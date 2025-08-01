export default function ModalPremiumAlert({ open, onClose }) {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="rounded-lg p-8 shadow-lg flex flex-col items-center max-w-xs bg-zinc-900/90"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-white text-lg font-bold mb-2">Spotify Premium requerido</div>
                <div className="text-gray-300 mb-6 text-center">Necesitas Spotify Premium para usar el reproductor de Riffter sin restricciones.</div>
                <div className="flex gap-3 w-full justify-center">
                    <button
                        className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                    <a
                        href="https://www.spotify.com/premium/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        Obtener Premium
                    </a>
                </div>
            </div>
        </div>
    );
}
