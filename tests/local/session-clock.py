"""Real-clock test for the local Auth stack only (20s JWT, 70s idle, 180s maximum)."""
import json
import secrets
import subprocess
import sys
import time
import uuid
from urllib.error import HTTPError
from urllib.request import Request, urlopen

settings = json.loads(subprocess.check_output([sys.argv[1], "status", "-o", "json"], stderr=subprocess.DEVNULL))
api = "http://127.0.0.1:55321/auth/v1"
anon, admin = settings["ANON_KEY"], settings["SERVICE_ROLE_KEY"]


def call(path, key, token, payload=None, method=None):
    req = Request(api + path, method=method, headers={
        "apikey": key, "Authorization": "Bearer " + token, "Content-Type": "application/json",
    }, data=json.dumps(payload).encode() if payload is not None else None)
    try:
        with urlopen(req, timeout=10) as result:
            return result.status, json.loads(result.read() or b"null")
    except HTTPError as exc:
        return exc.code, json.loads(exc.read())


def refresh(session):
    return call("/token?grant_type=refresh_token", anon, anon, {"refresh_token": session["refresh_token"]})


email, password = str(uuid.uuid4()) + "@example.test", secrets.token_urlsafe(32)
status, account = call("/admin/users", admin, admin, {"email": email, "password": password, "email_confirm": True})
assert status in (200, 201), status
try:
    def login():
        status, session = call("/token?grant_type=password", anon, anon, {"email": email, "password": password})
        assert status == 200 and session["expires_in"] == 20
        return session

    idle, active = login(), login()
    original = active["access_token"]
    assert call("/user", anon, original)[0] == 200
    start = time.monotonic()
    for deadline in (35, 75, 115, 155, 195):
        time.sleep(max(0, start + deadline - time.monotonic()))
        status, renewed = refresh(active)
        if deadline < 180:
            assert status == 200 and renewed["access_token"] != active["access_token"]
            assert call("/user", anon, renewed["access_token"])[0] == 200
            active = renewed
            print("refresh válido:", deadline, flush=True)
        else:
            assert status in (400, 401) and "session" in str(renewed).lower(), (status, renewed.get("error_code"))
            print("limite absoluto: refresh rejeitado", flush=True)
        if deadline == 115:
            assert call("/user", anon, original)[0] in (401, 403)
            status, detail = refresh(idle)
            assert status in (400, 401) and "session" in str(detail).lower(), (status, detail.get("error_code"))
            print("JWT original e refresh inativo rejeitados", flush=True)
finally:
    assert call("/admin/users/"+account["id"], admin, admin, method="DELETE")[0] in (200, 204)
