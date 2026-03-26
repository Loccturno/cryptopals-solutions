function checkOverflow(a, b, operation) {
    let result;
    if (operation === 'add') {
        result = a + b
    } else if (operation === 'sub') {
        result = a - b
    } else if (operation === 'mul') {
        result = a * b
    }

    let uint8Safe;
    if (result >= 0 && result <= 255) {
        uint8Safe = true
    } else {
        uint8Safe = false
    }

    let int8Safe;
    if (result >= -128 && result <= 127) {
        int8Safe = true
    } else {
        int8Safe = false
    }

    let wrappedUint8 = ((result % 256) + 256) % 256;
    
    return {
        result: result,
        uint8Safe: uint8Safe,
        int8Safe: int8Safe,
        wrappedUint8: wrappedUint8
    }
}

// Test
console.log(checkOverflow(200, 100, 'add'));
console.log(checkOverflow(10, 50, 'sub'));
console.log(checkOverflow(50, 3, 'mul'));