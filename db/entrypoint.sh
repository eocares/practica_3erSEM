#!/bin/bash
/opt/mssql/bin/sqlservr &
for i in $(seq 1 60); do
  /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" >/dev/null 2>&1 && break
  sleep 2
done
/opt/mssql-tools18/bin/sqlcmd -C -f 65001 -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -i /init.sql
wait
