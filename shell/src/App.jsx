import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import eventBus from 'shared/eventBus';
import './App.css';

const Header = lazy(() => import('mfeHeader/Navbar'));
const Lobby  = lazy(() => import('mfeLobby/Lobby'));
const Catalog = lazy(() => import('mfeCatalog/Catalog'));

function LoadingFallback({ name }) {
  return <div className="loading-fallback">Chargement {name}...</div>;
}

function App() {
  const [cartToast, setCartToast] = useState('');
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const unsubscribe = eventBus.on('cart:add', (product) => {
      setCartToast(`${product.name} ajoute au panier (${product.price} EUR)`);

      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = setTimeout(() => {
        setCartToast('');
      }, 2200);
    });

    return () => {
      unsubscribe();
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="shell">
      {cartToast && (
        <div className="cart-toast" role="status" aria-live="polite">
          {cartToast}
        </div>
      )}

      <Suspense fallback={<LoadingFallback name="Header" />}>
        <Header />
      </Suspense>

      <main className="shell-content">
        <div className="content-grid">
          <section className="section">
            <Suspense fallback={<LoadingFallback name="Lobby" />}>
              <Lobby />
            </Suspense>
          </section>

          <section className="section">
            <Suspense fallback={<LoadingFallback name="Catalog" />}>
              <Catalog />
            </Suspense>
          </section>
        </div>
      </main>

      <footer className="shell-footer">
        <p>Shell (3000) | Header (3001) | Lobby (3002) | Catalog (3003)</p>
      </footer>
    </div>
  );
}

export default App;
