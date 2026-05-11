'use client';

import { LoaderCircle } from 'lucide-react';

type LoadingOverlayProps = {
  open: boolean;
};

const progressItems = [
  'Parsing pages',
  'Indexing chapters',
  'Preparing the voice assistant',
];

const LoadingOverlay = ({ open }: LoadingOverlayProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-shadow-wrapper bg-[var(--bg-primary)] shadow-[var(--shadow-soft-lg)]">
        <div className="loading-shadow">
          <LoaderCircle className="loading-animation size-12 text-[#663820]" />
          <div className="space-y-2 text-center">
            <h2 className="loading-title">Beginning synthesis</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Your book is being prepared for a richer conversation.
            </p>
          </div>

          <div className="loading-progress">
            {progressItems.map((item) => (
              <div key={item} className="loading-progress-item">
                <span className="loading-progress-status" />
                <span className="text-[var(--text-secondary)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
