import { singleton } from 'tsyringe';
import { createStore, StoreApi } from 'zustand';
import { mainnet } from 'viem/chains';
import { TChain } from '../../types';
import { TPlugin } from '..';

export type Disk = ChainsmithStorage['disk'];
export type Ram = ChainsmithStorage['ram'];
export type ChainsmithStorage = {
  disk: {
    chains: TChain[];
    plugins: TPlugin[];
  };
  ram: Record<string, any>;
};

@singleton()
export class StoragePlugin<R extends Ram = any> {
  private storage: StoreApi<ChainsmithStorage> = createStore<ChainsmithStorage>(set => ({
    disk: {
      chains: [{ ...mainnet, ecosystem: 'evm', chainName: 'mainnet' }],
      plugins: [],
    },
    ram: {},
    writeToDisk: (data: Disk) => set({ disk: data }),
    writeToRam: (data: Ram) => set({ ram: data }),
  }));

  readDiskOrReturn<F extends keyof Disk>(obj: Record<F, any>): Disk[F] {
    const [key, value]: [F, Disk[F]] = Object.entries(obj)[0] as any;
    return value || this.storage.getState().disk[key];
  }

  readRamOrReturn<F extends keyof R>(obj: Record<F, any>): R[F] {
    const [key, value]: [F, R[F]] = Object.entries(obj)[0] as any;
    return value || (this.storage.getState().ram as R)[key];
  }

  readDisk<F extends keyof Disk>(key: F): Disk[F] {
    return this.storage.getState().disk[key];
  }

  readRam<F extends keyof Ram>(key: F): Ram[F] {
    return this.storage.getState().ram[key];
  }

  writeToDisk(key: keyof Disk, value: any) {
    const diskState = this.storage.getState().disk;
    return this.storage.setState({
      disk: {
        ...diskState,
        [key]: value,
      },
    });
  }

  writeToRam(key: string, value: any) {
    const ramState = this.storage.getState().ram;
    return this.storage.setState({
      ram: {
        ...ramState,
        [key]: value,
      },
    });
  }
}
