EMCC=emcc
CXXFLAGS=-O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME="SimulationModule" --bind -s ALLOW_MEMORY_GROWTH=1

SRC=$(wildcard *.cpp)
BUILD_DIR=../../static/wasm
OUT_JS=$(BUILD_DIR)/simulation.js

all: $(OUT_JS)

$(OUT_JS): $(SRC)
	mkdir -p $(BUILD_DIR)
	$(EMCC) $(CXXFLAGS) $(SRC) -o $(OUT_JS)

clean:
	rm -f $(BUILD_DIR)/simulation.js $(BUILD_DIR)/simulation.wasm

.PHONY: all clean
