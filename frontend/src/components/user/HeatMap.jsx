import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import "./profile.css";

const generateFullYearData = () => {
  const data = [];
  const start = new Date("2001-01-01");
  const end = new Date("2001-12-31");
  const current = new Date(start);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const count = current.getMonth() === 0 ? Math.floor(Math.random() * 50) : 0;
    data.push({ date: dateStr, count });
    current.setDate(current.getDate() + 1);
  }

  return data;
};

const getPanelColors = (maxCount) => {
  const colors = {};
  for (let i = 1; i <= maxCount; i++) {
    const green = Math.floor((i / maxCount) * 255); // green intensity
    colors[i] = `rgb(0, ${green}, 0)`;              // same formula
  }
  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const data = generateFullYearData();
    setActivityData(data);

    const janCounts = data.filter(d => d.count > 0).map(d => d.count);
    const maxCount = janCounts.length > 0 ? Math.max(...janCounts) : 1;
    setPanelColors(getPanelColors(maxCount));
  }, []);

  return (
    <div>
      <h4 style={{ color: "white", marginBottom: "10px" }}>Recent Contributions</h4>

      <HeatMap
        className="HeatMapProfile"
        style={{
          width: "100%",
          minWidth: "900px",
          height: "200px",
          color: "white"
        }}
        value={activityData}
        startDate={new Date("2001-01-01")}
        endDate={new Date("2001-12-31")}
        rectSize={15}
        space={3}
        rectProps={{ rx: 2.5 }}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        monthLabels={[
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]}
        panelColors={panelColors}
        rectRender={(props, data) => (
          <rect
            {...props}
            title={`${data.date}: ${data.count || 0} contributions`}
          />
        )}
      />
    </div>
  );
};

export default HeatMapProfile;
