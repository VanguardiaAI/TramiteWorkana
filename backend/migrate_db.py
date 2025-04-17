import sqlite3
import os

# Ruta a la base de datos
db_path = 'tramites.db'

def migrate_db():
    print("Iniciando migración de la base de datos...")
    
    # Verificar si la base de datos existe
    if not os.path.exists(db_path):
        print(f"Error: No se encontró la base de datos en {db_path}")
        return False
    
    conn = None
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar si la tabla tramite existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='tramite'")
        if not cursor.fetchone():
            print("Error: La tabla 'tramite' no existe")
            return False
        
        # Verificar si los campos ya existen
        cursor.execute("PRAGMA table_info(tramite)")
        columns = cursor.fetchall()
        column_names = [column[1] for column in columns]
        
        # Añadir campo numeroExpediente si no existe
        if 'numeroExpediente' not in column_names:
            print("Añadiendo campo 'numeroExpediente' a la tabla tramite...")
            cursor.execute("ALTER TABLE tramite ADD COLUMN numeroExpediente TEXT")
            print("Campo 'numeroExpediente' añadido con éxito")
        else:
            print("El campo 'numeroExpediente' ya existe")
        
        # Añadir campo tension si no existe
        if 'tension' not in column_names:
            print("Añadiendo campo 'tension' a la tabla tramite...")
            cursor.execute("ALTER TABLE tramite ADD COLUMN tension TEXT")
            print("Campo 'tension' añadido con éxito")
        else:
            print("El campo 'tension' ya existe")
        
        # Guardar cambios
        conn.commit()
        print("Migración completada con éxito")
        return True
        
    except Exception as e:
        print(f"Error durante la migración: {str(e)}")
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    migrate_db() 