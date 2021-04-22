import { Typography } from '@material-ui/core';
import moment from 'moment';
import { useState } from 'react';
import { isEmpty } from 'utils/helpers/helpers';

const GREY_400 = '#BDBDBD';
const WHITE = '#ffffff';
const DATE_FORMAT_BACK_END = 'DD-MM-YYYY';

const cellStyle = {
  height: 52,
  width: 52,
  padding: 0,
};
const headerStyle = {
  padding: 8,
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '14px',
  textAlign: 'center',
  color: '#1A202C',
  background: '#EDF2F7',
};

const CalendarCustom = (props) => {
  const { startDate, endDate, setStartDate, setEndDate } = props;
  const [monthStart, setMonthStart] = useState(0);
  const [hoverDate, setHoverDate] = useState(null);

  const isOutsideRange = (date) => {
    return date.isBefore(moment(), 'days');
  };
  const handleSelectDate = (day) => {
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
      let cellBG = WHITE;
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
            background: cellBG,
            color: isEdge ? 'white' : '#1A202C',
            borderTopLeftRadius:
              startDate && day.isSame(startDate, 'days') ? 8 : 0,
            borderBottomLeftRadius:
              startDate && day.isSame(startDate, 'days') ? 8 : 0,
            borderTopRightRadius:
              endDate && day.isSame(endDate, 'days') ? 8 : 0,
            borderBottomRightRadius:
              endDate && day.isSame(endDate, 'days') ? 8 : 0,
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
              height: '100%',
              padding: 4,
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography
              style={{
                width: '100%',
                textAlign: 'center',
                color: getColorDay(day, isEdge),
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
        style={{ borderCollapse: 'collapse', width: '100%' }}
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
                {/* {iMonth === 0 && monthStart !== 0 && (
                  <IconArrowDownToggle
                    style={{
                      marginLeft: 12,
                      transform: 'rotate(90deg)',
                      cursor: monthStart === 0 ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() =>
                      setMonthStart(
                        monthStart > 0 ? monthStart - 1 : monthStart
                      )
                    }
                  />
                )} */}
                <Typography
                  variant="subtitle1"
                  style={{
                    userSelect: 'none',
                    fontSize: 16,
                    lineHeight: '19px',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  Tháng {m.format('MM')}, {m.format('YYYY')}
                </Typography>
                {/* {iMonth === 1 && (
                  <IconArrowDownToggle
                    style={{
                      marginRight: 12,
                      transform: 'rotate(-90deg)',
                      cursor: 'pointer',
                    }}
                    onClick={() => setMonthStart(monthStart + 1)}
                  />
                )} */}
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
