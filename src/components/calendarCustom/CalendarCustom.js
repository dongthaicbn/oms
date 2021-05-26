import { Typography } from '@material-ui/core';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { getMonth, isEmpty } from 'utils/helpers/helpers';
import { ReactComponent as ArrowDownIcon } from 'assets/icons/ic_arrow_down.svg';
import { FormattedMessage } from 'react-intl';

const GREY_400 = '#BDBDBD';
const DATE_FORMAT_BACK_END = 'DD-MM-YYYY';
const TYPE_SINGLE = 'single';
const headerStyle = {
  padding: 8,
  fontWeight: 600,
  fontSize: 24,
  lineHeight: '36px',
  textAlign: 'center',
  color: '#1A202C',
};

const CalendarCustom = (props) => {
  const { startDate, endDate, setStartDate, setEndDate, type, selectAnyDate } = props;
  const [monthStart, setMonthStart] = useState(0);
  // const [hoverDate, setHoverDate] = useState(null);
  const [innerWidth, setInnerWidth] = useState(0)
  const cellStyle = { height: innerWidth > 576 ? 64 : 0, width: 64, padding: 0 };

  // let innerWidth = window.innerWidth;
  useEffect(() => {

    function handleResize() {
      // Set window width/height to state
      setInnerWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();

  }, [])
  const isOutsideRange = (date) => {
    if (props.selectAnyDate) {
      return false
    }
    return date.isBefore(moment(), 'days');
  };
  const handleSelectDate = (day) => {
    if (type === TYPE_SINGLE) {
      setStartDate(day);
      setEndDate(null);
    } else {
      if (startDate && endDate && !startDate.isSame(endDate, 'days')) {
        setStartDate(day);
        setEndDate(null);
      } else if (startDate) {
        if (day.isBefore(startDate, 'days')) {
          setEndDate(startDate);
          setStartDate(day);
        } else {
          setEndDate(day);
        }
      } else if (endDate) {
        if (day.isBefore(endDate, 'days')) {
          setStartDate(day);
        } else {
          setStartDate(startDate);
          setEndDate(day);
        }
      } else {
        setStartDate(day);
        // setEndDate(day);
      }
    }
  };
  const getColorDay = (day, isEdge) => {
    if (isOutsideRange(day)) return GREY_400;
    if (day.isSame(moment(), 'days')) return isEdge ? 'white' : '#00B6F3';
    return undefined;
  };

  const renderCalendar = (m, iMonth) => {
    const totalCells = [];
    let week = [];
    const allWeeks = [];
    const firstDayOfMonth = m.startOf('month');
    for (let d = 1; d < firstDayOfMonth.day(); d += 1) {
      totalCells.push(
        <td
          style={cellStyle}
          isFocus={false}
          hover={false}
          key={`blank${d} `}
        />
      );
    }
    for (let d = 0; d < m.daysInMonth(); d += 1) {
      const day = m.clone().add(d, 'days');
      const isSelected =
        startDate &&
        endDate &&
        day.isSameOrBefore(endDate, 'days') &&
        day.isSameOrAfter(startDate, 'days');

      const isEdge =
        (startDate && day.isSame(startDate, 'days')) ||
        (endDate && day.isSame(endDate, 'days'));
      startDate &&
        endDate &&
        day.isSameOrBefore(endDate, 'days') &&
        day.isSameOrAfter(startDate, 'days');
      let cellBG = '#F7F9FF';
      let cellClass = '';
      if (isSelected) cellBG = '#F0F0FC';
      if (isEdge)
        cellBG = 'linear-gradient(272.96deg, #2593D0 0%, #80D1FF 100%)';
      if (startDate && !isOutsideRange(day)) {
        if (day.isBefore(startDate, 'days')) cellClass = 'normal-date';
        if (day.isAfter(startDate, 'days') && isEmpty(endDate)) {
          cellClass = 'actived-date';
        }
      }
      if (endDate && day.isAfter(endDate, 'days') && !isOutsideRange(day)) {
        cellClass = 'normal-date';
      }
      totalCells.push(
        <td
          draggable={false}
          hover
          key={`day_${day.format(DATE_FORMAT_BACK_END)}`}
          style={{
            ...cellStyle,
            background: isEdge ? '#F0F0FC' : cellBG,
            color: isEdge ? 'white' : '#1A202C',
            borderTopLeftRadius:
              (startDate && day.isSame(startDate, 'days')) ||
                type === TYPE_SINGLE
                ? 64
                : 0,
            borderBottomLeftRadius:
              (startDate && day.isSame(startDate, 'days')) ||
                type === TYPE_SINGLE
                ? 64
                : 0,
            borderTopRightRadius:
              (endDate && day.isSame(endDate, 'days')) || type === TYPE_SINGLE
                ? 64
                : 0,
            borderBottomRightRadius:
              (endDate && day.isSame(endDate, 'days')) || type === TYPE_SINGLE
                ? 64
                : 0,
            cursor: isOutsideRange(day) ? 'not-allowed' : 'pointer',
          }}
          onClick={() => {
            if (isOutsideRange(day)) return;
            handleSelectDate(day);
          }}
          onMouseOver={() => {
            // console.log("mouse over");
          }}
        >
          <td
            className={cellClass}
            style={{
              ...cellStyle,
              padding: 4,
              justifyContent: 'center',
              flexDirection: 'column',
              background: cellBG,
              borderRadius:
                (startDate && day.isSame(startDate, 'days')) ||
                  (endDate && day.isSame(endDate, 'days'))
                  ? '50%'
                  : 0,
            }}
          >
            <Typography
              style={{
                width: '100%',
                textAlign: 'center',
                color: getColorDay(day, isEdge),
                fontSize: 24,
                lineHeight: '36px',
              }}
              variant="body2"
            >
              {d + 1}
            </Typography>
          </td>
        </td>
      );
    }
    for (
      let d = 1;
      d <= (7 - ((m.daysInMonth() + firstDayOfMonth.day()) % 7)) % 7;
      d += 1
    ) {
      totalCells.push(
        <td
          style={cellStyle}
          isFocus={false}
          hover={false}
          key={`blank${d + firstDayOfMonth.day()} `}
        />
      );
    }

    totalCells.forEach((day, index) => {
      if (index % 7 !== 0) {
        week.push(day);
      } else {
        allWeeks.push(week);
        week = [];
        week.push(day);
      }
      if (index === totalCells.length - 1) {
        allWeeks.push(week);
      }
    });
    return (
      <table
        style={{ borderCollapse: 'collapse', width: innerWidth > 576 ? 448 : 300, margin: 'auto' }}
        draggable={false}
      >
        <thead>
          <tr>
            <td colSpan={7}>
              <div
                style={{
                  display: 'flex',
                  padding: '6px 0 16px 0',
                  alignItems: 'center',
                }}
              >
                <ArrowDownIcon
                  style={{
                    transform: 'rotate(90deg)',
                    cursor: monthStart === 0 ? 'not-allowed' : 'pointer',
                  }}
                  className="active-icon"
                  onClick={() =>
                    setMonthStart(monthStart > 0 ? monthStart - 1 : monthStart)
                  }
                />

                <Typography
                  variant="subtitle1"
                  style={{
                    userSelect: 'none',
                    fontSize: 24,
                    lineHeight: '36px',
                    fontWeight: 600,
                    color: '#6461B4',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <FormattedMessage id={getMonth(m.format('MM'))} />{' '}
                  {m.format('YYYY')}
                </Typography>

                <ArrowDownIcon
                  style={{ transform: 'rotate(-90deg)' }}
                  className="active-icon"
                  onClick={() => setMonthStart(monthStart + 1)}
                />
              </div>
            </td>
          </tr>
        </thead>
        <thead>
          <tr>
            <td style={headerStyle}>Mo</td>
            <td style={headerStyle}>Tu</td>
            <td style={headerStyle}>We</td>
            <td style={headerStyle}>Th</td>
            <td style={headerStyle}>Fr</td>
            <td style={headerStyle}>Sa</td>
            <td style={headerStyle}>Su</td>
          </tr>
        </thead>
        <tbody>
          {allWeeks.map((w, i) => {
            return <tr key={`week${i} `}>{w}</tr>;
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        width: 'calc(100% + 24px)',
        justifyContent: 'space-between',
        margin: '0 -12px',
        marginTop: 36,
      }}
    >
      {[monthStart].map((v, index) => {
        return (
          <div key={index} style={{ width: '100%', margin: '0 12px' }}>
            {renderCalendar(moment().add(v, 'months').startOf('month'), index)}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarCustom;
