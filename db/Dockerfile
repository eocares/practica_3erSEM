FROM mcr.microsoft.com/mssql/server:2022-latest
ENV ACCEPT_EULA=Y
COPY init.sql /init.sql
COPY --chmod=755 entrypoint.sh /entrypoint.sh
CMD ["/entrypoint.sh"]
