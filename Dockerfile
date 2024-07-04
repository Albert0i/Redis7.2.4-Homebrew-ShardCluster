FROM mcr.microsoft.com/windows/nanoserver:20H2

WORKDIR /Data

USER ContainerAdministrator
RUN setx /M PATH "%PATH%;C:\Redis" &&\
    cd \ &&\
    curl -OL "https://github.com/zkteco-home/redis-windows/archive/refs/heads/master.zip" &&\ 
    tar -C \ -xvf master.zip &&\
    del master.zip &&\
    ren redis-windows-master Redis 
USER ContainerUser

COPY redis.conf /Redis

CMD ["redis-server.exe","C:\\Redis\\redis.conf"]

EXPOSE 6379

#
# EOF (2022/06/18)
#