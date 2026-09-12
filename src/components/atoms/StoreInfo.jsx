import Image from "./Image";
import TimeImage from "/StoreInfo/Time.svg";
import MapImage from "/StoreInfo/Map.svg";
import TelImage from "/StoreInfo/Tel.svg";

const StoreInfo = ({ weekhour, weekendhour, tel, address }) => {
  // 전화번호에 하이픈
  const telFormatter = (tel) => {
    tel = tel.replace(/[^0-9]/g, "");
    return tel.replace(
      /(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,
      "$1-$2-$3",
    );
  };

  return (
    <section className="grid gap-2 p-4 bg-gray-100 rounded-lg">
      <h2 className="font-semibold">매장정보</h2>
      <div className="flex items-center gap-2">
        <Image src={TimeImage} alt="영업시간" />
        <div className="text-sm">
          <div>{weekhour}</div>
          <div>{weekendhour}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Image src={TelImage} alt="전화번호" />
        <a href={`tel:${tel}`} className="text-sm underline">
          {telFormatter(tel)}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Image src={MapImage} alt="주소" />
        <div className="text-sm">{address}</div>
      </div>
    </section>
  );
};

export default StoreInfo;
