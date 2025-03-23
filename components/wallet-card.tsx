"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface WalletCardProps {
  wallet: {
    id: string
    name: string
    address: string
    balance: string
    currency?: string
    signers: number
    threshold: number
    members?: Array<{
      address: string
      isYou: boolean
      status: "pending" | "synchronized"
    }>
  }
  isSelected?: boolean
  onClick?: () => void
}

export default function WalletCard({ wallet, isSelected = false, onClick }: WalletCardProps) {
  // Remove this line:
  // const [showFullAddress, setShowFullAddress] = useState(false)

  // Count pending members and synchronized members
  const pendingMembers = wallet.members?.filter((m) => m.status === "pending").length || 0
  const synchronizedMembers = wallet.members?.filter((m) => m.status === "synchronized").length || 0
  const status = pendingMembers > 0 ? "pending" : "synchronized"

  // Replace these lines:
  // const displayAddress = showFullAddress
  //   ? wallet.address
  //   : `${wallet.address.substring(0, 10)}...${wallet.address.substring(wallet.address.length - 8)}`

  // With this simplified version:
  const displayAddress = `${wallet.address.substring(0, 10)}...${wallet.address.substring(wallet.address.length - 8)}`

  return (
    <Card
      className={cn(
        "hover:bg-accent/50 transition-colors cursor-pointer",
        isSelected && "border-primary/50 bg-accent/50",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{wallet.name}</h3>
            {/* Replace this section: */}
            {/* <div className="flex flex-col">
              <p className="text-xs text-muted-foreground font-mono">{displayAddress}</p>
              {!showFullAddress && (
                <Button
                  variant="link"
                  className="text-xs p-0 h-auto text-primary w-fit"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowFullAddress(true)
                  }}
                >
                  Show all
                </Button>
              )}
              {showFullAddress && (
                <Button
                  variant="link"
                  className="text-xs p-0 h-auto text-primary w-fit"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowFullAddress(false)
                  }}
                >
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Hide
                </Button>
              )}
            </div> */}

            {/* With this simplified version: */}
            <p className="text-xs text-muted-foreground font-mono">{displayAddress}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-medium">
              {wallet.balance} {wallet.currency || "WLD"}
            </span>
            <span className="text-xs text-muted-foreground">WorldCoin</span>
            <div className="flex items-center mt-1">
              <span className="text-xs">World ID Network</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link href={`/wallet/${wallet.id}/members`} onClick={(e) => e.stopPropagation()}>
            <Badge variant="outline" className="font-normal hover:bg-accent cursor-pointer">
              <Users className="h-3 w-3 mr-1" />
              {synchronizedMembers}/{wallet.signers} signers
            </Badge>
          </Link>
          <Badge
            variant={status === "synchronized" ? "secondary" : "outline"}
            className={status === "pending" ? "text-amber-500 border-amber-500" : ""}
          >
            {status === "synchronized" ? "Synchronized" : "Pending"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

