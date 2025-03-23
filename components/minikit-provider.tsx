'use client' // Required for Next.js

import { ReactNode, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

interface MiniKitProviderProps {
	children: ReactNode;
	appId?: string;
}

export function MiniKitProvider({ children, appId = "multiris-wallet" }: MiniKitProviderProps) {
	useEffect(() => {
		// Passing appId in the install is optional 
		// but allows you to access it later via `window.MiniKit.appId`
		if (typeof window !== 'undefined') {
			try {
				MiniKit.install(appId)
				console.log('MiniKit installed with appId:', appId)
			} catch (error) {
				console.error('Error installing MiniKit:', error)
			}
		}
	}, [appId])

	return <>{children}</>
}

// Add default export for backward compatibility
export default MiniKitProvider;
