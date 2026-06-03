import pytest
from auth.middleware import RoleChecker
from fastapi import HTTPException
import unittest.mock as mock

def test_role_checker_allowed():
    checker = RoleChecker(["GERENTE"])
    user = {"cargo": "GERENTE"}
    # Should not raise exception
    assert checker(user) == user

def test_role_checker_denied():
    checker = RoleChecker(["GERENTE"])
    user = {"cargo": "ATENDENTE"}
    with pytest.raises(HTTPException) as exc:
        checker(user)
    assert exc.value.status_code == 403
