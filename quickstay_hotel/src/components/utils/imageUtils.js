const sniffMimeType = (base64) => {
    if (typeof base64 !== "string" || base64.length < 8) return "image/jpeg"
    if (base64.startsWith("/9j/")) return "image/jpeg"
    if (base64.startsWith("iVBORw0KGgo")) return "image/png"
    if (base64.startsWith("R0lGOD")) return "image/gif"
    if (base64.startsWith("UklGR")) return "image/webp"
    return "image/jpeg"
}

const bytesToBase64 = (bytes) => {
    if (!bytes || bytes.length === 0) return ""
    let binary = ""
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize)
        binary += String.fromCharCode(...chunk)
    }
    return btoa(binary)
}

const normalizeToBase64String = (source) => {
    if (!source) return ""
    if (typeof source === "string") return source
    if (source instanceof Uint8Array) return bytesToBase64(source)
    if (Array.isArray(source)) return bytesToBase64(Uint8Array.from(source))
    if (typeof source === "object") {
        if (source.data && Array.isArray(source.data)) {
            return bytesToBase64(Uint8Array.from(source.data))
        }
        if (source.bytes && Array.isArray(source.bytes)) {
            return bytesToBase64(Uint8Array.from(source.bytes))
        }
    }
    return ""
}

export const buildImageSrc = (source, mimeType) => {
    const normalized = normalizeToBase64String(source)
    if (!normalized) return ""
    if (normalized.startsWith("data:") || normalized.startsWith("http") || normalized.startsWith("blob:")) {
        return normalized
    }
    const resolvedType = mimeType || sniffMimeType(normalized)
    return `data:${resolvedType};base64,${normalized}`
}

export const buildRoomImageSrc = (room) => {
    if (!room) return ""
    const source = room.photo ?? room.photoUrl ?? room.imageUrl ?? room.image ?? ""
    const mimeType = room.photoType ?? room.photoContentType ?? room.contentType ?? ""
    return buildImageSrc(source, mimeType || undefined)
}
