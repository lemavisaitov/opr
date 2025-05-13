FROM golang:1.24-bookworm

RUN apt-get update ;\
    apt-get install -y autoconf automake libtool make gcc pkg-config libmagic-dev libssl-dev libjansson-dev ;\
    wget https://github.com/VirusTotal/yara/archive/refs/tags/v4.5.2.tar.gz ;\
    tar xzvf v4.5.2.tar.gz ;\
    rm v4.5.2.tar.gz ;\
    cd yara-4.5.2 ;\
    ./bootstrap.sh ;\
    ./configure --enable-cuckoo --enable-magic --enable-dotnet ;\
    make ;\
    make install ;\
    ldconfig

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN mkdir -p /app && \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/api-gateway ./cmd/

COPY yara_rules ./yara_rules

ENTRYPOINT ["./api-gateway"]