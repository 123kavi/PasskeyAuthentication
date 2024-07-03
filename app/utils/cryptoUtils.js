// Convert Uint8Array to Hexadecimal String
exports.toHexString = (byteArray) => {
    return Array.prototype.map.call(byteArray, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
};

// Convert Hexadecimal String to Uint8Array
exports.fromHexString = (hexString) => {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
};
