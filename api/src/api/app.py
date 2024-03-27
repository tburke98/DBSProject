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


@app.route("/table")
def read_table_all() -> list:
    return query(f"select * from my_table")


@app.route("/table/<id>")
def read_table(id: int) -> list:
    return query(f"select * from my_table where id = {id}")
