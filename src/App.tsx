/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ConfigScreen } from "./features/board/components/ConfigScreen";
import { DisplayScreen } from "./features/board/components/DisplayScreen";
import type { BoardConfig } from "./features/board/schemas/config";

export default function App() {
  const [config, setConfig] = useState<BoardConfig | null>(null);

  return (
    <main className="min-h-screen bg-black text-white w-full">
      {config ? (
        <DisplayScreen config={config} onExit={() => setConfig(null)} />
      ) : (
        <ConfigScreen onStart={(c) => setConfig(c)} />
      )}
    </main>
  );
}
