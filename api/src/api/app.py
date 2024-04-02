from flask import Flask, jsonify
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


def query(query: str) -> list:
    with db_pool.cursor() as db:
        db.execute(query)
        return db.fetchall()


@app.route("/orders")
def read_orders_all() -> list:
    return query(f"SELECT * FROM order_parts")


@app.route("/suppliers")
def read_suppliers_all() -> list:
    return query(f"SELECT * FROM suppliers, phone_numbers WHERE _id = supplier_id ")
