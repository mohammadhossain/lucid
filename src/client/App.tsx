import * as React from 'react';

import Quiz from './Quiz';

export const App = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Welcome to UI Team code assessment!</h2>
        <Quiz/>
        
    </div>
);