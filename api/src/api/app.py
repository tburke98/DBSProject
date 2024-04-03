from flask import Flask, jsonify
from flask_cors import CORS
from os import environ as env
from mysql.connector import connect as db_connect

db_config = {
    "host": env.get("DB_HOST"),
    "user": env.get("DB_USER"),
    "password": env.get("DB_PASSWORD"),
    "database": env.get("DB_NAME"),
    "pool_name": "pool",
    "pool_size": int(env.get("DB_POOL_SIZE")),
}

db_pool = db_connect(**db_config)
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


def query(query: str) -> list:
    with db_pool.cursor(dictionary=True) as db:
        db.execute(query)
        return db.fetchall()


@app.route("/api/orders")
def read_orders_all() -> list:
    order_query = """
       select o._id, o.supplier_id, o.order_date, 
       group_concat(CONCAT(p.part_id, ':', p.quantity) separator ', ') AS parts_and_quantities
       from orders AS o
       left join order_parts AS p ON o._id = p.order_id
       group by o._id;
    """
    return query(order_query)


@app.route("/api/suppliers")
def read_suppliers_all() -> list:
    supplier_query = """
      select s._id, s.name, s.email, group_concat(distinct p.phone_number separator ', ') as phones from suppliers as s
      join phone_numbers as p ON s._id = p.supplier_id
      group by s._id
    """
    return query(supplier_query)
