export async function httpGet(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error en la API");
        return await res.json();
    } catch (e) {
        console.error("Error HTTP:", e);
        return null;
    }
}
