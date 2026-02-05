"""
Helper utility functions
"""
from datetime import datetime
from typing import Any, Dict


def serialize_datetime(obj: Any) -> Any:
    """
    Serialize datetime objects to ISO format strings
    """
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj


def deserialize_datetime(data: Dict[str, Any], *fields: str) -> Dict[str, Any]:
    """
    Deserialize ISO format strings to datetime objects
    """
    for field in fields:
        if field in data and isinstance(data[field], str):
            data[field] = datetime.fromisoformat(data[field])
    return data


def prepare_for_db(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Prepare data for MongoDB insertion by serializing datetime fields
    """
    result = data.copy()
    for key, value in result.items():
        if isinstance(value, datetime):
            result[key] = value.isoformat()
    return result


def prepare_from_db(data: Dict[str, Any], *datetime_fields: str) -> Dict[str, Any]:
    """
    Prepare data from MongoDB by deserializing datetime fields
    """
    return deserialize_datetime(data, *datetime_fields)