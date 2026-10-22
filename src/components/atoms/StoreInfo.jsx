const InfoIcon = ({ type }) => {
  const paths = {
    time: (
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm.75 4.75a.75.75 0 0 0-1.5 0V12c0 .25.125.484.334.623l3.5 2.333a.75.75 0 1 0 .832-1.248l-3.166-2.11V6.75Z"
        clipRule="evenodd"
      />
    ),
    tel: (
      <path d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    ),
    map: (
      <path
        fillRule="evenodd"
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 10.25a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z"
        clipRule="evenodd"
      />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="w-6 h-6 text-gray-500 shrink-0"
      fill="currentColor"
    >
      {paths[type]}
    </svg>
  );
};

const StoreInfo = ({ weekhour, weekendhour, tel, address }) => {
  const telFormatter = (value) => {
    const digits = value.replace(/[^0-9]/g, "");
    return digits.replace(
      /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
      "$1-$2-$3",
    );
  };

  return (
    <section className="store-info-section w-full max-w-full min-w-0 overflow-hidden bg-white border-gray-200 border-y">
      <h2 className="px-4 pt-3 text-base font-bold">매장정보</h2>
      <dl className="px-4 divide-y divide-gray-100">
        <div className="flex items-center gap-3 py-2 md:py-3">
          <InfoIcon type="time" />
          <div className="store-hours-grid">
            <div className="flex min-w-0 flex-col items-start gap-0.5">
              <dt>평일</dt>
              <dd>{weekhour}</dd>
            </div>
            <div className="flex min-w-0 flex-col items-start gap-0.5">
              <dt>주말</dt>
              <dd>{weekendhour}</dd>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 py-2 md:py-3">
          <InfoIcon type="tel" />
          <div className="min-w-0">
            <dt className="mb-0.5 text-xs font-medium text-gray-500">전화</dt>
            <dd>
              <a
                href={`tel:${tel}`}
                aria-label={`전화 걸기 ${telFormatter(tel)}`}
                className="text-base font-medium text-gray-800 underline decoration-gray-300 underline-offset-2"
              >
                {telFormatter(tel)}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex items-center gap-4 py-2 md:py-3">
          <InfoIcon type="map" />
          <div className="min-w-0">
            <dt className="mb-0.5 text-xs font-medium text-gray-500">주소</dt>
            <dd className="break-keep text-sm leading-5 text-gray-800 md:text-base md:leading-6">
              {address}
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
};

export default StoreInfo;
