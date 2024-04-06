from flask import Flask, request as req
from flask_cors import CORS
from os import environ as env
from mysql.connector import connect as db_connect
from pydantic import ValidationError, BaseModel
import re

from datetime import date
from typing import List, Tuple, Any

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


def insert(query: str, args: Tuple[Any] = None) -> None:
    with db_pool.cursor(dictionary=True) as db:
        db.execute(query, args)
        db_pool.commit()


def query(query: str, args: Tuple[Any] = None) -> list:
    with db_pool.cursor(dictionary=True) as db:
        db.execute(query, args)
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
def read_suppliers() -> list:
    supplier_query = """
      select s._id, s.name, s.email, group_concat(distinct p.phone_number separator ', ') as phones from suppliers as s
      join phone_numbers as p ON s._id = p.supplier_id
      group by s._id
    """
    return query(supplier_query)


@app.route("/api/suppliers/<_id>")
def read_supplier(_id: int) -> list:
    supplier_query = f"""
      select s._id, s.name, s.email, group_concat(distinct p.phone_number separator ', ') as phones from suppliers as s
      join phone_numbers as p ON s._id = p.
      where s._id = {_id}
      group by s._id
    """
    return query(supplier_query, (_id,))


@app.route("/api/budget")
def read_budget() -> list:
    year = date.today().year - 1
    budget_query = f"""
      select sum(parts.price * order_parts.quantity) as expenses from orders
      join order_parts on orders._id=order_parts.order_id
      join parts on order_parts.part_id=parts._id
      where year(orders.order_date) = {year}
      group by year(orders.order_date)
    """
    return query(budget_query)[0]


class Supplier(BaseModel):
    name: str
    email: str
    phones: str


@app.route("/api/add_supplier", methods=["POST"])
def add_supplier() -> str:
    try:
        supplier_data = request.json
        s = Supplier(**supplier_data)
    except (ValidationError, ValueError) as e:
        return ("Invalid POST data!", 400)
    add_supplier_query = "insert into suppliers (name, email) values (%s, %s)"
    insert(add_supplier_query, (s.name, s.email))
    regex = r"\d{1,3}-\(\d{3}\)\d{3}-\d{4}"  # xxx-(xxx)xxx-xxxx
    phone_numbers = re.findall(regex, s.phones)
    for num in phone_numbers:
        phone_query = "insert into phone_numbers (phone_number, supplier_id) values (%s, %s)"
        insert(phone_query, (num, s.id))
    return "Supplier inserted."


@app.route("/api/expenses/<start>/<end>")
def read_expenses_all(start, end) -> list:
    expenses_query = f"""
      SELECT DATE_FORMAT(o.order_date, '%Y') as year, sum(op.quantity * p.price) as total_expense
      FROM orders as o
      JOIN order_parts as op ON o._id = op.order_id
      JOIN parts as p ON op.part_id = p._id
      WHERE DATE_FORMAT(o.order_date, '%Y') BETWEEN {start} AND {end}
      GROUP BY DATE_FORMAT(o.order_date, '%Y');
    """
    return query(expenses_query)


@app.route("/api/parts")
def read_parts_all() -> list:
    part_query = """
       select * from parts
    """
    return query(part_query)
