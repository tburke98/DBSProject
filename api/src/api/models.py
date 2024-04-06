from pydantic import BaseModel, Field


class Supplier(BaseModel):
    id: int = Field(alias="_id")
    name: str
    email: str
    phones: str


class YearRange(BaseModel):
    start: int
    end: int


# class Budget(BaseModel):
#     numyear: int
#     rates: float
