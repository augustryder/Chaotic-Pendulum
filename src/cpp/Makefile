EMCC=emcc
CXXFLAGS=-O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME="PendulumModule" --bind -s ALLOW_MEMORY_GROWTH=1

SRC=$(wildcard *.cpp)
BUILD_DIR=../../static/wasm
OUT_JS=$(BUILD_DIR)/pendulum.js

all: $(OUT_JS)

$(OUT_JS): $(SRC)
	mkdir -p $(BUILD_DIR)
	$(EMCC) $(CXXFLAGS) $(SRC) -o $(OUT_JS)

clean:
	rm -f $(BUILD_DIR)/pendulum.js $(BUILD_DIR)/pendulum.wasm

.PHONY: all clean 