import { TextWithIcon } from "../atoms/TextWithIcon";
import MapWithPin from "../atoms/MapWithPin";
import { Button } from "../atoms/Button";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

const iconsrc = {
  calendar: "/TextWithIcon/calendar.png",
  clock: "/TextWithIcon/clock.png",
  location: "/TextWithIcon/location.png",
  price: "/TextWithIcon/price.png",
};

const PaymentResultTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationData } = location.state || {};

  const reservation = reservationData?.reservation;
  const carwash = reservationData?.carwash;
  const hasResult =
    reservation?.time?.start &&
    reservation?.time?.end &&
    typeof reservation?.price === "number" &&
    carwash?.name &&
    Number.isFinite(carwash?.location?.latitude) &&
    Number.isFinite(carwash?.location?.longitude);

  if (!hasResult) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <h1 className="text-2xl font-bold">
          결제 완료 정보를 확인할 수 없습니다.
        </h1>
        <p className="mt-4 text-gray-600">
          결제 결과 페이지를 새로고침했거나 잘못된 경로로 접근했습니다.
        </p>
        <Button
          variant="long"
          className="flow-primary-action fixed bottom-0 left-0"
          onClick={() => navigate("/history")}
        >
          예약 내역 확인
        </Button>
      </div>
    );
  }

  const {
    reservation: {
      time: { start, end },
      price: price,
    },
    carwash: {
      name: carwashname,
      location: { latitude, longitude },
    },
  } = reservationData;

  const formatTime = (dateTime) => {
    return dayjs(dateTime).format("HH시 mm분");
  };

  const formatDate = (dateTime) => {
    return dayjs(dateTime).format("YYYY년 MM월 DD일");
  };

  return (
    <div>
      <div className="relative">
        <h1 className="py-8 text-2xl font-bold text-center">
          결제가 완료되었습니다
        </h1>
        <div className="py-4 overflow-hidden rounded-lg bg-gray-50">
          <div className="flex flex-col gap-4 p-4">
            <TextWithIcon text={formatDate(start)} iconsrc={iconsrc.calendar} />
            <TextWithIcon
              text={`${formatTime(start)} - ${formatTime(end)}`}
              iconsrc={iconsrc.clock}
            />
            <TextWithIcon text={carwashname} iconsrc={iconsrc.location} />
            <TextWithIcon
              text={`${price.toLocaleString()}원`}
              iconsrc={iconsrc.price}
            />
            <MapWithPin lat={latitude} lng={longitude} text={carwashname} />
          </div>
        </div>
      </div>
      <Button
        variant="long"
        className="flow-primary-action fixed bottom-0 left-0"
        onClick={() => navigate("/")}
      >
        홈으로
      </Button>
    </div>
  );
};

export default PaymentResultTemplate;
