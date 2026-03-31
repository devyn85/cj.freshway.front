import { createContext, ReactNode, useCallback, useState } from "react";
import { RooutyMapInstance } from "../hooks/useMap";

type MountedMapsContextValue = {
  maps: { [id: string]: RooutyMapInstance };
  onMapMount: (map: RooutyMapInstance, id: string) => void;
  onMapUnmount: (id: string) => void;
};

export const MountedMapsContext = createContext<MountedMapsContextValue | null>(
  null
);

export const RooutyMapProvider = ({ children }: { children?: ReactNode }) => {
  const [maps, setMaps] = useState<{ [id: string]: RooutyMapInstance }>({});

  const onMapMount = useCallback(
    (map: RooutyMapInstance, id: string = "default") => {
      setMaps((currMaps) => {
        if (id === "current") {
          throw new Error("'current' cannot be used as map id");
        }
        if (currMaps[id]) {
          throw new Error(`Multiple maps with the same id: ${id}`);
        }
        return { ...currMaps, [id]: map };
      });
    },
    []
  );

  const onMapUnmount = useCallback((id: string = "default") => {
    setMaps((currMaps) => {
      if (currMaps[id]) {
        const nextMaps = { ...currMaps };
        delete nextMaps[id];
        return nextMaps;
      }
      return currMaps;
    });
  }, []);

  return (
    <MountedMapsContext.Provider
      value={{
        maps,
        onMapMount,
        onMapUnmount,
      }}
    >
      {children}
    </MountedMapsContext.Provider>
  );
};
