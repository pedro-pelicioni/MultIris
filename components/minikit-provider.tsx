'use client'

import { ReactNode, useEffect } from 'react'

interface MiniKitProviderProps {
  children: ReactNode;
  appId?: string;
}

export function MiniKitProvider({ children, appId }: MiniKitProviderProps) {
  useEffect(() => {
    // Instala o MiniKit no carregamento do componente
    if (typeof window !== 'undefined') {
      try {
        // Verifica se já está no World App
        if (window.MiniKit && window.MiniKit.isInstalled()) {
          console.log('MiniKit já está instalado e pronto para uso')
        } else {
          console.log('Executando fora do World App ou MiniKit não instalado')
          
          // Exemplo para testes locais
          // Simula a presença do MiniKit para desenvolvimento local
          if (process.env.NODE_ENV === 'development') {
            console.log('Ambiente de desenvolvimento - simulando MiniKit')
            
            // Cria um objeto MiniKit simulado para desenvolvimento
            window.MiniKit = {
              isInstalled: () => true,
              commands: {
                verify: async (options: any) => {
                  console.log('Simulando verificação com MiniKit:', options)
                  return {
                    finalPayload: {
                      status: 'success',
                      nullifier_hash: 'simulated_nullifier_hash_for_dev',
                      merkle_root: 'simulated_merkle_root_for_dev',
                      proof: 'simulated_proof_for_dev',
                      verification_level: options.verification_level || 'device',
                      action: options.action || 'multiris-auth-sepolia',
                      signal: options.signal || '',
                      success: true
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro durante a inicialização do MiniKit:', error)
      }
    }
  }, [appId])

  return <>{children}</>
} 