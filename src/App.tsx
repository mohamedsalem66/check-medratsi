// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InvoiceDetails from "./screen/InvoiceDetails";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/fr/:invoiceId" element={<InvoiceDetails language="fr" />} />
                    <Route path="/ar/:invoiceId" element={<InvoiceDetails language="ar" />} />
                    <Route path="/:invoiceId" element={<InvoiceDetails language="fr" />} /> {/* Default to French */}
                    <Route path="/" element={<div>Please provide an invoice ID in the URL</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
