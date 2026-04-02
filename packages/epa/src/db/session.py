"""Database session management."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from ..config import DATABASE_URL
from .models import Base

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)


def init_db():
    """Create EPA-specific tables (does not touch TypeORM-managed tables)."""
    Base.metadata.create_all(engine)


def get_db():
    """Dependency for FastAPI endpoints."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
