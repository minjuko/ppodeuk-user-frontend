import TimeImage from "/StoreInfo/Time.svg";
import Image from "../atoms/Image";
import BayList from "../organisms/BayList";
import { carwashesBays, carwashesInfo } from "../../apis/carwashes";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Warning from "/warning.svg";
import DatePicker from "../molecules/DatePicker";
import { useState } from "react";

const BaySelectionTemplate = ({ carwashId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [carwashInfoData, baysData] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["getCarwashesInfo", carwashId],
        queryFn: () => carwashesInfo(carwashId),
      },
      {
        queryKey: ["baylists", carwashId],
        queryFn: () => carwashesBays(carwashId),
      },
    ],
  });

  const detailData = carwashInfoData.data.data.response.optime;
  const name = carwashInfoData.data.data.response.name;
  const bayListData = baysData.data.data.response.bayList || [];

  const handleBayClick = (bayId) => {
    dispatch({ type: "SET_BAY_ID", payload: bayId });
    navigate(`/schedule/${carwashId}/${bayId}`, {
      state: { selectedDate: selectedDate.toISOString() },
    });
  };

  const renderBayContent = () => {
    if (bayListData && bayListData.length > 0) {
      return (
        <div className="grid gap-4">
          <div className="font-semibold text-primary">
            원하는 베이를 클릭하여 예약을 진행해보세요
          </div>
          <DatePicker handleButtonClick={setSelectedDate} />
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary" />
              예약 가능 시간
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300" />
              예약된 시간
            </div>
          </div>
          <BayList
            bays={bayListData}
            openingHours={detailData}
            selectedDate={selectedDate}
            onClick={handleBayClick}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center gap-8 mt-16">
          <img src={Warning} alt="경고 아이콘" className="block w-12" />
          <div>해당 세차장에는 등록된 베이가 없습니다.</div>
        </div>
      );
    }
  };

  return (
    <div className="p-4 grid-4">
      <h1 className="text-2xl font-bold">{name}: 베이 선택</h1>
      <section className="flex items-center gap-2">
        <Image src={TimeImage} alt="영업시간" className="" />
        <div>
          <div>
            평일 {detailData.weekday.start} ~ &nbsp;
            {detailData.weekday.end === "00:00"
              ? "24:00"
              : detailData.weekday.end}
          </div>
          <div>
            주말 {detailData.weekend.start} ~ &nbsp;
            {detailData.weekend.end === "00:00"
              ? "24:00"
              : detailData.weekend.end}
          </div>
        </div>
      </section>
      <div>{renderBayContent()}</div>
    </div>
  );
};

export default BaySelectionTemplate;
