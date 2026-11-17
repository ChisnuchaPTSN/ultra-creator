import React from 'react';
import { BRAND_LOGOS } from '../brandLogos';

export default function ClientLogos({ motion, t }) {
  const cls = t?.clientLogosSec;
  return (
    <section className={`client-logos ${motion ? '' : 'no-motion'}`} aria-label={cls?.ariaLabel || 'พาร์ทเนอร์และแบรนด์ที่ร่วมงาน'}>
      <p className="eyebrow">{cls?.eyebrow || 'แบรนด์ที่เติบโตไปด้วยกัน'}</p>
      <div className="logo-window" tabIndex={0} aria-label={cls?.ariaLabel || 'แถบโลโก้พาร์ทเนอร์'}>
        <div className="logo-belt">
          {[0, 1].map((copy) => (
            <div className="logo-group" key={copy} aria-hidden={copy === 1}>
              {BRAND_LOGOS.map((brand) => (
                <div className="client-logo-tile" key={`${copy}-${brand.id}`} title={brand.name}>
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
