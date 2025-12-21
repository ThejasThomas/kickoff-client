import { useEffect, useState } from "react"

  const NotFound = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-white animate-pulse" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-white animate-pulse" />
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white" />

        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white" />
      </div>

      {/* Floating Soccer Balls */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-[15%] left-[10%] text-6xl transition-all duration-1000 ${mounted ? "opacity-30" : "opacity-0"}`}
        >
          ⚽
        </div>
        <div
          className={`absolute top-[70%] right-[15%] text-5xl transition-all duration-1000 delay-300 ${mounted ? "opacity-20" : "opacity-0"}`}
        >
          ⚽
        </div>
        <div
          className={`absolute bottom-[20%] left-[20%] text-4xl transition-all duration-1000 delay-500 ${mounted ? "opacity-25" : "opacity-0"}`}
        >
          ⚽
        </div>
      </div>

      <div
        className={`relative z-10 text-center px-4 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* 404 Number with Goal Net Effect */}
        <div className="relative inline-block mb-6">
          <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-2xl">
            404
          </h1>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[length:50px_50px] pointer-events-none" />
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Off the Field!</h2>
        <p className="text-slate-400 text-lg md:text-xl mb-3 max-w-md mx-auto leading-relaxed">
          Looks like this page has been sent to the bench.
        </p>
        <p className="text-slate-500 text-base mb-8">The turf you're looking for doesn't exist.</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

        </div>

        {/* Help Text */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Need help? Contact us at{" "}
            <a href="mailto:support@kickoff.com" className="text-emerald-400 hover:text-emerald-300 underline">
              support@kickoff.com
            </a>
          </p>
        </div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
    </div>
  )
}

export default NotFound
