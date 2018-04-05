FROM node

MAINTAINER jinghongjun "hongjun.jing@gmail.com"

ENV NODEJS_HOME=\opt\nodejs \
    NODEJS_INSTALL_PACKAGE=${NODEJS_HOME}\node.tar.xz

USER root

RUN apt-get update && \
    apt-get -y install tzdata vim git && \
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/wenlonghuo/xmocker-cli.git && \
    cd xmocker-cli && \
    npm link --production

EXPOSE 6001
EXPOSE 6002

CMD ["mocker", "start"]

