import ImageCarousel from "../atoms/ImageCarousel";
import StoreInfo from "../atoms/StoreInfo";
import KeyPointInfo from "../atoms/KeyPointInfo";
import Star from "../atoms/Star";
import { Tab } from "../molecules/Tab";
import { useSuspenseQuery } from "@tanstack/react-query";
import { carwashesInfo } from "../../apis/carwashes";
import { useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import StatusBar from "../atoms/StatusBar";

const CarwashDetailTemplate = ({ carwashId }) => {
  const { data } = useSuspenseQuery({
    queryKey: ["getCarwashesInfo", carwashId],
    queryFn: () => carwashesInfo(carwashId),
  });
  const navigate = useNavigate();
  const detailData = data.data.response;

  const weekdayOpeningHours = `${detailData.optime.weekday.start}–${
    detailData.optime.weekday.end === "00:00"
      ? "24:00"
      : detailData.optime.weekday.end
  }`;
  const weekendOpeningHours = `${detailData.optime.weekend.start}–${
    detailData.optime.weekend.end === "00:00"
      ? "24:00"
      : detailData.optime.weekend.end
  }`;

  const images =
    detailData.imageFileList?.length > 0
      ? detailData.imageFileList.map((image) => ({
          label: "Image",
          alt: detailData.name,
          url: image.url,
        }))
      : [
          {
            label: "Image Not Found",
            alt: "세차장 등록된 이미지가 없습니다",
            url: "/CarwashDetail/CarwashImgNotFound.png",
          },
        ];

  return (
    <div className="relative w-full max-w-full mb-16 overflow-x-hidden overflow-y-auto">
      <StatusBar />
      <div className="w-full max-w-full min-w-0">
        <ImageCarousel images={images} />
        <div className="w-full max-w-full min-w-0 p-3 pb-0 bg-gray-50">
          <div className="grid min-w-0 gap-3">
            <section
              className="flex items-start justify-between min-w-0 gap-4 py-1"
              aria-labelledby="carwash-name"
            >
              <div className="min-w-0">
                <h1 id="carwash-name" className="text-2xl font-bold truncate">
                  {detailData.name}
                </h1>
                <Star
                  starCount={detailData.rate.toFixed(1)}
                  reviewCount={detailData.reviewCnt}
                />
              </div>
              <div className="px-3 py-2 text-center border rounded-xl bg-sky-50 border-sky-100 shrink-0">
                <div className="text-3xl font-extrabold leading-none text-primary">
                  {detailData.bayCnt}
                </div>
                <h2 className="mt-1 text-xs font-bold text-gray-700">
                  예약베이
                </h2>
              </div>
            </section>
            <StoreInfo
              weekhour={weekdayOpeningHours}
              weekendhour={weekendOpeningHours}
              tel={detailData.tel}
              address={detailData.locationDTO.address}
            />
            <KeyPointInfo selectedPoints={detailData.keywordIdList} />
          </div>
        </div>
        <Tab introduction={detailData.description} carwashId={carwashId} />
      </div>
      <Button
        variant="long"
        className="fixed bottom-0 left-0 right-0"
        onClick={() => navigate(`/bayselection/${carwashId}`)}
      >
        예약하러 가기
      </Button>
    </div>
  );
};

export default CarwashDetailTemplate;
