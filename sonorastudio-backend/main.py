from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, cast, String, text
from pydantic import BaseModel
from typing import List

from app.db.conexion import get_db

from app.schemas.views import (
    RegistrarFichaSchema, 
    DashboardFinanzasSchema, 
    DashboardClienteSchema, 
    DashboardIngenieroSchema, 
    DashboardProductorSchema,

    TendenciaSchema,
    TopClienteSchema,
    DistribucionServicioSchema,
    EquipoSchema
)

from app.models.views import (
    DashboardFinanzasModel, 
    DashboardClienteModel, 
    DashboardIngenieroModel, 
    DashboardProductorModel
)
app = FastAPI(title="Sonora Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    usuario: str 
    contrasena: str

@app.post("/api/login")
def iniciar_sesion(data: LoginRequest, db: Session = Depends(get_db)):
    query = text("SELECT ruc_cliente, razon_social, contrasena FROM cliente WHERE ruc_cliente = :ruc")
    result = db.execute(query, {"ruc": data.usuario}).fetchone()

    if not result:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    ruc_db, nombre_db, pass_db = result

    if pass_db != data.contrasena:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    return {
        "status": "success",
        "rol": "cliente",
        "ruc": str(ruc_db),
        "nombre": str(nombre_db)
    }

@app.get("/")
def read_root():
    return {"status": "ok", "mensaje": "API de Sonora Studio conectada a Supabase"}


@app.get("/api/dashboard/productor", response_model=List[DashboardProductorSchema])
def obtener_dashboard_productor(
    busqueda: str = Query(None, description="Término para buscar por ID, proyecto o cliente"),
    filtro_estado: str = Query("Todos", description="Filtro por estado de producción"),
    db: Session = Depends(get_db)
):
    consulta = db.query(DashboardProductorModel)

    if busqueda:
        termino = f"%{busqueda}%"
        consulta = consulta.filter(
            or_(
                DashboardProductorModel.nombre_proyecto.ilike(termino),
                DashboardProductorModel.nombre_cliente.ilike(termino),
                cast(DashboardProductorModel.id_proyecto, String).ilike(termino)
            )
        )

    if filtro_estado == "Pendientes":
        consulta = consulta.filter(DashboardProductorModel.total_episodios == 0)
    elif filtro_estado == "En Proceso":
        consulta = consulta.filter(DashboardProductorModel.total_episodios > 0)

    consulta = consulta.order_by(DashboardProductorModel.id_proyecto.desc())

    return consulta.all()

@app.get("/api/dashboard/cliente/{ruc_cliente}", response_model=List[DashboardClienteSchema])
def obtener_dashboard_cliente(ruc_cliente: str, db: Session = Depends(get_db)):
    datos = db.query(DashboardClienteModel).filter(DashboardClienteModel.ruc_cliente == ruc_cliente).all()
    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron proyectos para este cliente")
    return datos

@app.get("/api/dashboard/ingeniero/{id_ingeniero}", response_model=List[DashboardIngenieroSchema])
def obtener_dashboard_ingeniero(id_ingeniero: int, db: Session = Depends(get_db)):
    datos = db.query(DashboardIngenieroModel).filter(DashboardIngenieroModel.id_ingeniero == id_ingeniero).all()
    if not datos:
        raise HTTPException(status_code=404, detail="No se encontraron episodios para este ingeniero")
    return datos

@app.get("/api/dashboard/finanzas", response_model=DashboardFinanzasSchema)
def obtener_dashboard_finanzas(db: Session = Depends(get_db)):
    finanzas = db.query(DashboardFinanzasModel).first()
    if not finanzas:
        return {"ingresos_mes": 0.0, "cuentas_por_cobrar": 0.0, "facturas_pendientes": 0}
    return finanzas

@app.get("/api/clientes")
def obtener_lista_clientes(db: Session = Depends(get_db)):
    query = text("SELECT ruc_cliente, razon_social FROM cliente ORDER BY razon_social ASC")
    
    resultados = db.execute(query).fetchall()
    
    clientes = []
    for row in resultados:
        clientes.append({
            "ruc": str(row[0]),  
            "nombre": str(row[1]) 
        })
        
    if not clientes:
        return [{"ruc": "20100200300", "nombre": "Cliente Demo (Sin DB)"}]
        
    return clientes

@app.put("/api/episodio/{id_episodio}/ficha")
def registrar_ficha_tecnica(id_episodio: int, data: RegistrarFichaSchema, db: Session = Depends(get_db)):
    query = text("""
        UPDATE episodio 
        SET cadena_plugins = :plugins, 
            nivel_lufs = :lufs, 
            observaciones = :obs, 
            estado_episodio = :estado 
        WHERE id_episodio = :id
    """)
    
    resultado = db.execute(query, {
        "plugins": data.cadena_plugins,
        "lufs": data.nivel_lufs,
        "obs": data.observaciones,
        "estado": data.estado_episodio,
        "id": id_episodio
    })
    
    db.commit()
    
    if resultado.rowcount == 0:
        raise HTTPException(status_code=404, detail="Episodio no encontrado en el sistema")
        
    return {"status": "success", "mensaje": "Ficha técnica grabada y track enviado a revisión"}




@app.get("/api/dashboard/bi/tendencia", response_model=List[TendenciaSchema])
def bi_tendencia(db: Session = Depends(get_db)):
    query = text("""
        SELECT TO_CHAR(f.fecha_emision, 'Mon') as mes, SUM(df.cantidad * s.precio_unitario) as total
        FROM factura f
        JOIN detalle_factura df ON f.num_factura = df.num_factura
        JOIN servicio s ON df.cod_servicio = s.cod_servicio
        GROUP BY TO_CHAR(f.fecha_emision, 'Mon'), EXTRACT(MONTH FROM f.fecha_emision)
        ORDER BY EXTRACT(MONTH FROM f.fecha_emision)
    """)
    resultados = db.execute(query).fetchall()
    return [{"mes": r[0], "total": float(r[1]) if r[1] else 0} for r in resultados]

@app.get("/api/dashboard/bi/top-clientes", response_model=List[TopClienteSchema])
def bi_top_clientes(db: Session = Depends(get_db)):
    query = text("""
        SELECT c.razon_social, SUM(df.cantidad * s.precio_unitario) as total_facturado
        FROM cliente c
        JOIN factura f ON c.ruc_cliente = f.ruc_cliente
        JOIN detalle_factura df ON f.num_factura = df.num_factura
        JOIN servicio s ON df.cod_servicio = s.cod_servicio
        GROUP BY c.razon_social
        ORDER BY total_facturado DESC
        LIMIT 5
    """)
    resultados = db.execute(query).fetchall()
    return [{"nombre": r[0], "facturado": float(r[1]) if r[1] else 0} for r in resultados]

@app.get("/api/dashboard/bi/distribucion", response_model=List[DistribucionServicioSchema])
def bi_distribucion(db: Session = Depends(get_db)):
    query = text("""
        SELECT s.descripcion_servicio, SUM(df.cantidad) as total_ventas
        FROM servicio s
        JOIN detalle_factura df ON s.cod_servicio = df.cod_servicio
        GROUP BY s.descripcion_servicio
        ORDER BY total_ventas DESC
    """)
    resultados = db.execute(query).fetchall()
    return [{"name": r[0], "value": int(r[1])} for r in resultados]

@app.get("/api/dashboard/bi/equipo", response_model=List[EquipoSchema])
def bi_equipo(db: Session = Depends(get_db)):
    query = text("""
        SELECT i.id_ingeniero, i.nombres, i.especialidad, i.seniority, i.software_top, i.rating_qc, i.velocidad_entrega,
                COUNT(e.id_episodio) as carga
        FROM ingeniero i
        LEFT JOIN episodio e ON i.id_ingeniero = e.id_ingeniero AND e.estado != 'Aprobado'
        GROUP BY i.id_ingeniero, i.nombres, i.especialidad, i.seniority, i.software_top, i.rating_qc, i.velocidad_entrega
    """)
    resultados = db.execute(query).fetchall()
    
    equipo = []
    for r in resultados:
        partes = str(r[1]).split(" ")
        iniciales = (partes[0][0] + (partes[1][0] if len(partes)>1 else "")).upper()
        
        carga = int(r[7])
        limite = 5 
        estado = "Sobrecargado" if carga >= limite else ("Ocupada" if carga > 0 else "Disponible")
        
        equipo.append({
            "id": r[0], 
            "nombre": r[1], 
            "especialidad": r[2] if r[2] else "Ingeniero", 
            "seniority": r[3] if r[3] else "Junior",
            "software": r[4] if r[4] else "Pro Tools", 
            "qc": float(r[5]) if r[5] else 5.0, 
            "velocidad": int(r[6]) if r[6] else 100, 
            "carga": carga, 
            "limite": limite, 
            "estado": estado, 
            "iniciales": iniciales
        })
    return equipo