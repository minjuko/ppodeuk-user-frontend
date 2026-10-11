import OperatingHoursCard from "../atoms/OperatingHoursCard";
import BayList from "../organisms/BayList";
import { carwashesBays, carwashesInfo } from "../../apis/carwashes";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Warning from "/warning.svg";
import DatePicker from "../molecules/DatePicker";
import { useState } from "react";
import { getDemoDate } from "../../utils/demoDate";

const BaySelectionTemplate = ({ carwashId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(() => getDemoDate());
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

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-extrabold text-gray-900">
        {name}: 베이 선택
      </h1>
      <OperatingHoursCard openingHours={detailData} />
      {bayListData.length > 0 ? (
        <div className="grid gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              예약할 베이를 선택해 주세요
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              원하는 베이를 누르면 시간 선택 화면으로 이동합니다.
            </p>
          </div>
          <section className="grid gap-2">
            <h2 className="font-bold text-gray-900">날짜 선택</h2>
            <DatePicker handleButtonClick={setSelectedDate} />
          </section>
          <div
            className="flex items-center gap-5 text-sm text-gray-700"
            aria-label="예약 시간 범례"
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              예약 가능 시간
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 rounded-sm" />
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
      ) : (
        <div className="flex flex-col items-center gap-8 mt-16">
          <img src={Warning} alt="경고 아이콘" className="block w-12" />
          <div>해당 세차장에는 등록된 베이가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default BaySelectionTemplate;
