import OperatingHoursCard from "../atoms/OperatingHoursCard";
import BayList from "../organisms/BayList";
import { carwashesBays, carwashesInfo } from "../../apis/carwashes";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Warning from "/warning.svg";
import DatePicker from "../molecules/DatePicker";
import { useEffect, useState } from "react";
import { getDemoDate } from "../../utils/demoDate";
import { setBayId, setCarwashId } from "../../store/action";
import {
  selectReservationBayId,
  selectReservationCarwashId,
} from "../../store/reservationSelectors";
import {
  isValidReservationDate,
  parseReservationRouteId,
} from "../../utils/reservationRoute";

const BaySelectionTemplate = ({ carwashId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedCarwashId = useSelector(selectReservationCarwashId);
  const selectedBayId = useSelector(selectReservationBayId);
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
  const responseBayList = baysData.data.data.response.bayList;
  const bayListData = Array.isArray(responseBayList)
    ? responseBayList.filter(
        (bay) => parseReservationRouteId(bay?.bayId) !== null,
      )
    : [];
  const hasSelectedBay = bayListData.some(
    (bay) =>
      parseReservationRouteId(bay.bayId) ===
      parseReservationRouteId(selectedBayId),
  );
  useEffect(() => {
    const validCarwashId = parseReservationRouteId(carwashId);
    const carwashChanged =
      validCarwashId !== null &&
      parseReservationRouteId(selectedCarwashId) !== validCarwashId;
    if (carwashChanged) {
      dispatch(setCarwashId(validCarwashId));
      return;
    }
    if (validCarwashId !== null && selectedBayId !== null && !hasSelectedBay) {
      dispatch(setCarwashId(validCarwashId));
    }
  }, [carwashId, dispatch, selectedCarwashId, selectedBayId, hasSelectedBay]);

  const handleBayClick = (candidateBayId) => {
    const selectedBayId = parseReservationRouteId(candidateBayId);
    const bayExists = bayListData.some(
      (bay) => parseReservationRouteId(bay.bayId) === selectedBayId,
    );
    if (
      selectedBayId === null ||
      !bayExists ||
      !isValidReservationDate(selectedDate)
    ) {
      return;
    }
    dispatch(setBayId(selectedBayId));
    navigate(`/schedule/${carwashId}/${selectedBayId}`, {
      state: { selectedDate: selectedDate.toISOString() },
    });
  };

  return (
    <div className="reservation-bay-page mx-auto grid gap-3 p-4 md:max-w-4xl md:gap-6">
      <h1 className="text-2xl font-extrabold text-gray-900">
        {name}: 베이 선택
      </h1>
      <OperatingHoursCard openingHours={detailData} />
      {bayListData.length > 0 ? (
        <div className="reservation-bay-content grid gap-3">
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
            <DatePicker
              className="reservation-bay-date-picker"
              selectedDate={selectedDate}
              handleButtonClick={setSelectedDate}
            />
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
