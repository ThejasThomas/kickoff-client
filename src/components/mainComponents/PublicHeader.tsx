import Logo from "../../assets/logo.png"

interface PublicHeaderProps {
  className?: string
}

export const PublicHeader = ({ className }: PublicHeaderProps) => {
  return (
    <header className={`bg-white text-black py-6 px-6 flex justify-center items-center shadow-lg ${className}`}>
      <div className="flex items-center space-x-4 group">
        {/* Logo */}
        <div className="relative">
          <img
            src={Logo || "/placeholder.svg"}
            alt="KickOff Logo"
            className="w-12 h-12 rounded-lg shadow-lg transform group-hover:scale-110 transition-all duration-300"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-black shadow-lg group-hover:text-yellow-500 transition-colors duration-300">
          KickOff
        </h1>
      </div>
    </header>
  )
}
