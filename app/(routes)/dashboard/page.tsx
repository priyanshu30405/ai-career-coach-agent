import React from 'react';
import WelcomeBanner from './_components/WelcomeBanner'; 
import AiTools from './_components/AiToolsList';
import History from './_components/History';
import UsageIndicator from './_components/UsageIndicator';
import { UsageProvider } from './_components/UsageProvider';


function Dashboard() {
  return (
    <UsageProvider>
      <div className="p-6">
        <WelcomeBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <AiTools/>
          </div>
          <div className="lg:col-span-1">
            <UsageIndicator />
          </div>
        </div>
        <History/>
      </div>
    </UsageProvider>
  );
}

export default Dashboard;

