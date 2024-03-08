export default function MediosDePago() {

  const Rule = ({ color }: {color: any}) => (
    <hr
      style={{
        borderColor: color,
        margin: '8px',
      }}
    />
  );

  return (
    <>
      <Rule color="green"></Rule>
      <div>
        <p className='title'>Efectivo</p>
        <div className='center'>
          <a href='http://www.pagofacil.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/pagofacil.png' alt="logo pagofacil" width={45} height={45}/></a>
          <a href='http://www.rapipago.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/rapipago.png' alt='logo rapipago' width={55} height={15} /></a>
          <a href='http://www.cobroexpress.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/cobroexpress.png' alt='logo cobroexpress' width={65} height={15} /></a>
          <a href='http://www.ripsa.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/ripsa.png' alt='logo ripsa' width={65} height={25} /></a>
          <a href='http://www.provincianet.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/provincianet.png' alt='logo provincianet' width={65} height={15} /></a>
        </div>
        <Rule color="green"></Rule>
      </div>
      <div>
        <p className='title'>Billetera digital</p>
        <div className='center'>
          <a href='http://www.mercadopago.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/mercadopago.png' alt="logo mercadopago" width={65} height={15}/></a>
          <a href='http://www.modo.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/modo.png' alt='logo modo' width={55} height={10} /></a>
          <a href='http://www.naranjax.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/naranjax.png' alt='logo naranjax' width={65} height={10} /></a>
          <a href='http://www.todopago.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/todopago.png' alt='logo todopago' width={65} height={20} /></a>
          <a href='http://www.uala.com.ar' target='_blank' rel='noreferrer'><img className='logo' src='/medios_pagos/uala.png' alt='logo uala' width={45} height={15} /></a>
        </div>
        <Rule color="green"></Rule>
      </div> 
            
      <style jsx>
      {`

        .title {
          margin-bottom: 2px;
          font-weight: 600;
        }

        .logo {
          transition: transform .2s;
          margin-right: 5px;
        }

        .logo:hover {
          transform: scale(1.1);
        }

        .center {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0px 5px 0px 5px;
        }

      `}
      </style>
    </>
  )
}