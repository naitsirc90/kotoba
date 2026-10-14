(() => {
const EMBEDDED_VOCABULARY = window.__KOTOBA_VOCABULARY__;
const embeddedVocabularyById = new Map((EMBEDDED_VOCABULARY.entries || []).map(v => [v.id, v]));
const KOTOBA_RELEASE = '3.1.11-cross-platform';
// Immutable, locally embedded priority index. This index does not change
// SRS deadlines, selected topics, Study Level gates or saved progress.
const KOTOBA_LEARNING_PRIORITY_SCORES = window.__KOTOBA_LEARNING_PRIORITY__?.scores || {};

// Editorially documented P03 semantic/homophone collisions. Never display a
// semantically valid other answer as an incorrect multiple-choice option.
const KOTOBA_QUIZ_EXCLUDED_PAIRS = new Set([["jmdict-1003450-3","jmdict-1236620-1"],["jmdict-1008790-1","jmdict-1550120-1"],["jmdict-1009390-1","jmdict-1538690-1"],["jmdict-1012760-3","jmdict-1529610-1"],["jmdict-1012960-1","jmdict-1328380-1"],["jmdict-1013560-1","jmdict-1253070-1"],["jmdict-1016260-1","jmdict-1360380-1"],["jmdict-1017070-1","jmdict-1210900-1"],["jmdict-1019280-2","jmdict-1329010-1"],["jmdict-1019740-2","jmdict-1480260-1"],["jmdict-1021750-1","jmdict-1212250-1"],["jmdict-1022650-1","jmdict-1237050-1"],["jmdict-1023360-1","jmdict-1449760-1"],["jmdict-1024400-1","jmdict-1173680-1"],["jmdict-1028260-1","jmdict-1212170-1"],["jmdict-1028650-1","jmdict-1453270-1"],["jmdict-1029100-1","jmdict-1260320-1"],["jmdict-1031210-1","jmdict-1333020-1"],["jmdict-1034630-1","jmdict-1274380-1"],["jmdict-1034880-1","jmdict-1260010-1"],["jmdict-1035900-1","jmdict-1442160-1"],["jmdict-1038320-1","jmdict-1221250-1"],["jmdict-1039680-1","jmdict-1295850-1"],["jmdict-1041370-3","jmdict-1442160-1"],["jmdict-1041970-1","jmdict-1158350-1"],["jmdict-1041970-1","jmdict-1173010-1"],["jmdict-1041970-1","jmdict-1588620-1"],["jmdict-1042570-1","jmdict-1299000-1"],["jmdict-1044200-1","jmdict-1224320-1"],["jmdict-1045630-2","jmdict-1334750-1"],["jmdict-1047880-2","jmdict-1355810-1"],["jmdict-1048030-1","jmdict-1310100-1"],["jmdict-1048830-2","jmdict-1543240-1"],["jmdict-1048960-1","jmdict-1212110-1"],["jmdict-1049270-1","jmdict-1235770-1"],["jmdict-1050070-1","jmdict-1158760-1"],["jmdict-1050490-1","jmdict-1254630-1"],["jmdict-1051040-1","jmdict-1235040-1"],["jmdict-1051940-1","jmdict-1147800-1"],["jmdict-1052690-1","jmdict-1250340-1"],["jmdict-1055220-1","jmdict-1213660-1"],["jmdict-1055220-1","jmdict-1213680-1"],["jmdict-1055520-1","jmdict-1341340-1"],["jmdict-1055780-1","jmdict-1223090-1"],["jmdict-1057630-1","jmdict-1310100-1"],["jmdict-1060600-1","jmdict-1356700-1"],["jmdict-1068870-1","jmdict-1543240-1"],["jmdict-1069720-1","jmdict-1264890-1"],["jmdict-1073830-1","jmdict-1184940-1"],["jmdict-1074930-1","jmdict-1319100-1"],["jmdict-1075020-1","jmdict-1212250-1"],["jmdict-1075150-1","jmdict-1401580-1"],["jmdict-1075820-1","jmdict-1342390-1"],["jmdict-1077160-1","jmdict-1218440-1"],["jmdict-1077240-1","jmdict-1499180-1"],["jmdict-1077250-1","jmdict-1499180-1"],["jmdict-1077340-1","jmdict-1326040-1"],["jmdict-1077450-1","jmdict-1401580-1"],["jmdict-1077790-1","jmdict-1146180-1"],["jmdict-1078830-1","jmdict-1325870-1"],["jmdict-1079290-2","jmdict-1237020-1"],["jmdict-1079760-1","jmdict-1360380-1"],["jmdict-1082260-1","jmdict-1520330-1"],["jmdict-1085570-1","jmdict-1299970-1"],["jmdict-1085720-1","jmdict-1478300-1"],["jmdict-1085920-1","jmdict-1505060-1"],["jmdict-1088740-1","jmdict-1629170-1"],["jmdict-1091340-1","jmdict-1361510-1"],["jmdict-1092260-2","jmdict-1361510-1"],["jmdict-1093870-1","jmdict-1200390-1"],["jmdict-1093880-1","jmdict-1200390-1"],["jmdict-1094650-3","jmdict-1310190-1"],["jmdict-1094680-1","jmdict-1279990-1"],["jmdict-1096910-1","jmdict-1956700-1"],["jmdict-1099720-2","jmdict-1310190-1"],["jmdict-1100560-2","jmdict-1440640-1"],["jmdict-1100640-1","jmdict-1264890-1"],["jmdict-1101690-2","jmdict-1290300-1"],["jmdict-1102280-1","jmdict-1274380-1"],["jmdict-1102560-1","jmdict-1531090-1"],["jmdict-1103000-1","jmdict-1403190-1"],["jmdict-1105070-4","jmdict-1312150-1"],["jmdict-1105670-1","jmdict-1236620-1"],["jmdict-1105800-1","jmdict-1312150-1"],["jmdict-1107340-1","jmdict-1450470-1"],["jmdict-1108870-1","jmdict-1212250-1"],["jmdict-1109210-1","jmdict-1333020-1"],["jmdict-1109860-1","jmdict-1559870-1"],["jmdict-1110210-1","jmdict-1172610-1"],["jmdict-1110340-1","jmdict-1250340-1"],["jmdict-1113300-1","jmdict-1252520-1"],["jmdict-1114740-1","jmdict-1227720-1"],["jmdict-1114810-1","jmdict-1351430-1"],["jmdict-1116710-1","jmdict-1401580-1"],["jmdict-1117080-1","jmdict-1442160-1"],["jmdict-1117080-1","jmdict-1543240-1"],["jmdict-1117210-1","jmdict-1218150-1"],["jmdict-1117310-1","jmdict-1196270-1"],["jmdict-1117310-1","jmdict-1327810-1"],["jmdict-1118830-1","jmdict-1256360-1"],["jmdict-1119180-1","jmdict-1326320-1"],["jmdict-1119810-1","jmdict-1183140-1"],["jmdict-1122290-1","jmdict-1212110-1"],["jmdict-1124510-1","jmdict-1254630-1"],["jmdict-1125490-2","jmdict-1165880-1"],["jmdict-1127100-1","jmdict-1183480-1"],["jmdict-1127270-1","jmdict-1299400-1"],["jmdict-1128980-1","jmdict-1172690-1"],["jmdict-1129040-1","jmdict-1326040-1"],["jmdict-1130110-1","jmdict-1264890-1"],["jmdict-1132680-1","jmdict-1326320-1"],["jmdict-1133790-2","jmdict-1543240-1"],["jmdict-1134190-1","jmdict-1172570-1"],["jmdict-1137120-1","jmdict-1304410-1"],["jmdict-1137760-1","jmdict-1311070-1"],["jmdict-1138980-1","jmdict-1478300-1"],["jmdict-1139230-1","jmdict-1290300-1"],["jmdict-1139940-1","jmdict-1234190-1"],["jmdict-1140270-1","jmdict-1234190-1"],["jmdict-1140530-1","jmdict-1146180-1"],["jmdict-1141440-1","jmdict-1218630-1"],["jmdict-1141730-1","jmdict-1221250-1"],["jmdict-1141730-2","jmdict-1180000-1"],["jmdict-1142680-1","jmdict-1145890-1"],["jmdict-1142680-1","jmdict-1180000-1"],["jmdict-1142760-1","jmdict-1512200-1"],["jmdict-1145265-1","jmdict-1145890-1"],["jmdict-1145265-1","jmdict-1180000-1"],["jmdict-1145290-1","jmdict-1153910-1"],["jmdict-1145290-1","jmdict-1228100-1"],["jmdict-1145290-2","jmdict-1227720-1"],["jmdict-1145430-1","jmdict-1343980-1"],["jmdict-1145510-1","jmdict-1330290-1"],["jmdict-1145890-1","jmdict-1151120-3"],["jmdict-1145890-1","jmdict-1179910-2"],["jmdict-1145890-1","jmdict-1199680-1"],["jmdict-1145890-1","jmdict-1449530-1"],["jmdict-1145890-1","jmdict-1449570-1"],["jmdict-1145890-1","jmdict-1512220-1"],["jmdict-1145890-1","jmdict-1512240-1"],["jmdict-1146140-1","jmdict-1240530-7"],["jmdict-1146180-1","jmdict-1411110-1"],["jmdict-1147020-1","jmdict-1590240-1"],["jmdict-1147570-1","jmdict-1279330-1"],["jmdict-1151120-3","jmdict-1180000-1"],["jmdict-1151120-8","jmdict-1254630-1"],["jmdict-1151800-2","jmdict-1295080-1"],["jmdict-1152280-1","jmdict-1857320-1"],["jmdict-1153910-1","jmdict-1227500-1"],["jmdict-1153910-1","jmdict-1228100-1"],["jmdict-1154860-1","jmdict-1453270-1"],["jmdict-1155840-1","jmdict-1413300-1"],["jmdict-1155950-2","jmdict-1513910-1"],["jmdict-1155960-1","jmdict-1184940-1"],["jmdict-1155960-2","jmdict-1184940-1"],["jmdict-1156120-1","jmdict-1401580-1"],["jmdict-1156210-1","jmdict-1238110-1"],["jmdict-1156220-1","jmdict-1238110-1"],["jmdict-1156290-1","jmdict-1531870-1"],["jmdict-1156290-1","jmdict-1531870-2"],["jmdict-1156290-1","jmdict-1589410-2"],["jmdict-1156480-1","jmdict-1222690-1"],["jmdict-1156720-1","jmdict-1158450-1"],["jmdict-1156720-1","jmdict-1222690-1"],["jmdict-1156720-2","jmdict-1158450-1"],["jmdict-1156720-3","jmdict-1158450-1"],["jmdict-1157580-1","jmdict-1481130-1"],["jmdict-1158120-1","jmdict-1182940-3"],["jmdict-1158120-1","jmdict-1190860-2"],["jmdict-1158120-1","jmdict-1200240-1"],["jmdict-1158120-1","jmdict-1219290-1"],["jmdict-1158120-1","jmdict-1219490-1"],["jmdict-1158120-1","jmdict-1431840-1"],["jmdict-1158120-1","jmdict-1431840-2"],["jmdict-1158120-1","jmdict-1431850-1"],["jmdict-1158120-1","jmdict-1510640-1"],["jmdict-1158120-1","jmdict-1526960-4"],["jmdict-1158120-1","jmdict-1528490-1"],["jmdict-1158120-1","jmdict-1556430-1"],["jmdict-1158120-1","jmdict-1586700-4"],["jmdict-1158150-1","jmdict-1481130-1"],["jmdict-1158280-1","jmdict-1158350-1"],["jmdict-1158330-2","jmdict-1158350-1"],["jmdict-1158350-1","jmdict-1158400-1"],["jmdict-1158350-1","jmdict-1173010-1"],["jmdict-1158350-1","jmdict-1173050-1"],["jmdict-1158350-1","jmdict-1272280-1"],["jmdict-1158350-1","jmdict-1357040-1"],["jmdict-1158350-1","jmdict-1404630-6"],["jmdict-1158350-1","jmdict-1441120-1"],["jmdict-1158350-1","jmdict-1441250-1"],["jmdict-1158350-1","jmdict-1481300-1"],["jmdict-1158350-1","jmdict-1538850-1"],["jmdict-1158350-1","jmdict-1588080-1"],["jmdict-1158350-1","jmdict-1588620-1"],["jmdict-1158350-1","jmdict-1613410-1"],["jmdict-1158350-1","jmdict-1704200-1"],["jmdict-1158450-1","jmdict-1159310-2"],["jmdict-1158450-1","jmdict-1159960-1"],["jmdict-1158450-1","jmdict-1205920-1"],["jmdict-1158450-1","jmdict-1496990-1"],["jmdict-1158450-1","jmdict-1513700-1"],["jmdict-1158450-1","jmdict-1513940-1"],["jmdict-1158760-1","jmdict-1187790-1"],["jmdict-1158760-1","jmdict-1371830-1"],["jmdict-1160790-3","jmdict-1326320-1"],["jmdict-1161190-1","jmdict-1182620-1"],["jmdict-1161570-1","jmdict-1449760-1"],["jmdict-1162220-1","jmdict-1449760-1"],["jmdict-1165880-1","jmdict-1234700-1"],["jmdict-1165880-1","jmdict-1273170-2"],["jmdict-1165880-1","jmdict-1285140-2"],["jmdict-1165880-1","jmdict-1317830-1"],["jmdict-1165880-1","jmdict-1347680-1"],["jmdict-1165880-1","jmdict-1401570-1"],["jmdict-1165880-1","jmdict-1407460-3"],["jmdict-1165880-1","jmdict-1414580-4"],["jmdict-1165880-1","jmdict-1448800-2"],["jmdict-1165880-1","jmdict-1581510-1"],["jmdict-1165880-1","jmdict-1584280-1"],["jmdict-1165880-1","jmdict-1956440-1"],["jmdict-1167750-1","jmdict-1199360-1"],["jmdict-1168060-2","jmdict-1223210-1"],["jmdict-1168060-2","jmdict-1351900-1"],["jmdict-1168390-1","jmdict-1212250-1"],["jmdict-1168830-1","jmdict-1215130-2"],["jmdict-1168830-1","jmdict-1252680-1"],["jmdict-1168830-1","jmdict-1298110-1"],["jmdict-1168830-1","jmdict-1337630-1"],["jmdict-1168830-1","jmdict-1386230-1"],["jmdict-1168830-1","jmdict-1434420-1"],["jmdict-1168830-1","jmdict-1538100-3"],["jmdict-1169870-5","jmdict-1329670-1"],["jmdict-1170500-2","jmdict-1235170-1"],["jmdict-1172610-1","jmdict-1278380-1"],["jmdict-1172610-1","jmdict-1583630-4"],["jmdict-1172610-1","jmdict-1592930-1"],["jmdict-1172690-1","jmdict-1214200-1"],["jmdict-1172690-1","jmdict-1251130-1"],["jmdict-1172690-1","jmdict-1305170-4"],["jmdict-1172690-1","jmdict-1307620-1"],["jmdict-1172690-1","jmdict-1310270-2"],["jmdict-1172690-1","jmdict-1409840-3"],["jmdict-1172690-1","jmdict-1598990-1"],["jmdict-1172830-1","jmdict-1297890-1"],["jmdict-1173010-1","jmdict-1173050-1"],["jmdict-1173010-1","jmdict-1272280-1"],["jmdict-1173010-1","jmdict-1404630-6"],["jmdict-1173010-1","jmdict-1481300-1"],["jmdict-1173010-1","jmdict-1538850-1"],["jmdict-1173010-1","jmdict-1588620-1"],["jmdict-1173050-1","jmdict-1588620-1"],["jmdict-1173660-1","jmdict-1173680-1"],["jmdict-1173680-1","jmdict-1212300-1"],["jmdict-1173680-1","jmdict-1212470-2"],["jmdict-1173680-1","jmdict-1215810-3"],["jmdict-1173680-1","jmdict-1217730-4"],["jmdict-1173680-1","jmdict-1272780-4"],["jmdict-1173680-1","jmdict-1310270-3"],["jmdict-1173680-1","jmdict-1375040-2"],["jmdict-1173680-1","jmdict-1375150-1"],["jmdict-1173680-1","jmdict-1400050-2"],["jmdict-1173680-1","jmdict-1499720-3"],["jmdict-1173680-1","jmdict-1554820-5"],["jmdict-1173680-1","jmdict-1587770-1"],["jmdict-1173970-1","jmdict-1272870-1"],["jmdict-1173970-1","jmdict-1531870-1"],["jmdict-1176660-1","jmdict-1229030-1"],["jmdict-1176660-1","jmdict-1327840-1"],["jmdict-1176660-1","jmdict-1328170-2"],["jmdict-1176660-1","jmdict-1344390-1"],["jmdict-1176660-1","jmdict-1554820-6"],["jmdict-1177040-1","jmdict-1543240-1"],["jmdict-1178210-1","jmdict-1477670-1"],["jmdict-1178210-2","jmdict-1477670-1"],["jmdict-1179040-1","jmdict-1179090-1"],["jmdict-1179090-1","jmdict-1273420-1"],["jmdict-1179720-2","jmdict-1310800-1"],["jmdict-1179720-2","jmdict-1310950-1"],["jmdict-1179810-1","jmdict-1179830-1"],["jmdict-1179830-1","jmdict-1338240-16"],["jmdict-1179830-1","jmdict-1449540-1"],["jmdict-1179840-2","jmdict-1310100-1"],["jmdict-1179910-2","jmdict-1180000-1"],["jmdict-1180000-1","jmdict-1199160-1"],["jmdict-1180000-1","jmdict-1199680-1"],["jmdict-1180000-1","jmdict-1449530-1"],["jmdict-1180000-1","jmdict-1512240-1"],["jmdict-1180000-1","jmdict-1512290-1"],["jmdict-1182620-1","jmdict-1421850-1"],["jmdict-1182620-1","jmdict-1421850-10"],["jmdict-1182620-1","jmdict-1421850-2"],["jmdict-1182620-1","jmdict-1421850-3"],["jmdict-1182620-1","jmdict-1421850-4"],["jmdict-1182620-1","jmdict-1421850-5"],["jmdict-1182620-1","jmdict-1421850-6"],["jmdict-1182620-1","jmdict-1421850-7"],["jmdict-1182620-1","jmdict-1421850-8"],["jmdict-1182620-1","jmdict-1421850-9"],["jmdict-1182790-1","jmdict-1593480-1"],["jmdict-1183380-1","jmdict-1183480-1"],["jmdict-1183460-1","jmdict-1513910-1"],["jmdict-1183480-1","jmdict-1183590-1"],["jmdict-1183480-1","jmdict-1605630-2"],["jmdict-1184940-1","jmdict-1186510-1"],["jmdict-1184940-1","jmdict-1190120-1"],["jmdict-1184940-1","jmdict-1282830-1"],["jmdict-1184940-1","jmdict-1297110-1"],["jmdict-1184940-1","jmdict-1434250-1"],["jmdict-1184940-1","jmdict-1493150-1"],["jmdict-1184940-1","jmdict-1548650-1"],["jmdict-1186510-1","jmdict-1434250-1"],["jmdict-1189960-1","jmdict-1495790-1"],["jmdict-1190430-1","jmdict-1228360-2"],["jmdict-1190430-1","jmdict-1469730-1"],["jmdict-1192920-1","jmdict-1414500-1"],["jmdict-1194500-8","jmdict-1223990-1"],["jmdict-1195710-1","jmdict-1330290-1"],["jmdict-1195890-1","jmdict-1477670-1"],["jmdict-1196060-1","jmdict-1478300-1"],["jmdict-1196060-2","jmdict-1236620-1"],["jmdict-1196120-1","jmdict-1538690-1"],["jmdict-1196120-2","jmdict-1253950-1"],["jmdict-1196170-1","jmdict-1196230-1"],["jmdict-1196170-1","jmdict-1544520-1"],["jmdict-1196230-1","jmdict-1250090-1"],["jmdict-1196230-1","jmdict-1250090-2"],["jmdict-1196230-1","jmdict-1250090-3"],["jmdict-1196230-1","jmdict-1250090-4"],["jmdict-1196230-1","jmdict-1250090-5"],["jmdict-1196230-1","jmdict-1258950-1"],["jmdict-1196230-1","jmdict-1516925-1"],["jmdict-1196230-1","jmdict-1516925-4"],["jmdict-1196230-1","jmdict-1516925-5"],["jmdict-1196230-1","jmdict-1544520-1"],["jmdict-1196270-1","jmdict-1251700-2"],["jmdict-1196270-1","jmdict-1274510-1"],["jmdict-1196270-1","jmdict-1360470-1"],["jmdict-1196970-1","jmdict-1365930-1"],["jmdict-1196970-2","jmdict-1318020-1"],["jmdict-1198430-1","jmdict-1251680-1"],["jmdict-1198770-1","jmdict-1401580-1"],["jmdict-1198790-1","jmdict-1401580-1"],["jmdict-1198960-1","jmdict-1254240-1"],["jmdict-1199080-1","jmdict-1386460-1"],["jmdict-1199080-1","jmdict-1587030-2"],["jmdict-1199250-1","jmdict-1272520-1"],["jmdict-1199400-1","jmdict-1221250-1"],["jmdict-1199640-2","jmdict-1297890-1"],["jmdict-1199640-3","jmdict-1341340-1"],["jmdict-1199720-1","jmdict-1500750-1"],["jmdict-1199720-2","jmdict-1316880-1"],["jmdict-1199830-3","jmdict-1341340-1"],["jmdict-1200390-1","jmdict-1269510-1"],["jmdict-1200390-1","jmdict-1279450-1"],["jmdict-1200390-1","jmdict-1279450-2"],["jmdict-1200390-1","jmdict-1289740-2"],["jmdict-1200390-1","jmdict-1360690-1"],["jmdict-1200390-1","jmdict-1528130-1"],["jmdict-1200960-1","jmdict-1201140-1"],["jmdict-1200960-1","jmdict-1277250-1"],["jmdict-1201020-1","jmdict-1500750-1"],["jmdict-1201140-1","jmdict-1277250-1"],["jmdict-1201140-1","jmdict-1277750-1"],["jmdict-1201140-1","jmdict-1353850-1"],["jmdict-1202130-1","jmdict-1242530-1"],["jmdict-1204330-1","jmdict-1218440-1"],["jmdict-1205190-1","jmdict-1403190-1"],["jmdict-1205200-3","jmdict-1497110-1"],["jmdict-1205270-2","jmdict-1328380-1"],["jmdict-1205480-1","jmdict-1360380-1"],["jmdict-1205820-1","jmdict-1505060-1"],["jmdict-1205870-1","jmdict-1359370-1"],["jmdict-1205870-1","jmdict-1359550-1"],["jmdict-1205950-1","jmdict-1273720-1"],["jmdict-1207500-2","jmdict-1242700-1"],["jmdict-1208780-1","jmdict-1505060-1"],["jmdict-1210270-1","jmdict-1213680-1"],["jmdict-1210590-1","jmdict-1453890-1"],["jmdict-1210750-1","jmdict-1303910-1"],["jmdict-1210900-1","jmdict-1580230-1"],["jmdict-1211290-1","jmdict-1346500-1"],["jmdict-1211440-1","jmdict-1333040-1"],["jmdict-1211490-1","jmdict-1211630-1"],["jmdict-1211490-1","jmdict-1340420-2"],["jmdict-1211490-1","jmdict-1340600-1"],["jmdict-1212110-1","jmdict-1212250-1"],["jmdict-1212170-1","jmdict-1329320-1"],["jmdict-1212170-1","jmdict-1537990-1"],["jmdict-1212250-1","jmdict-1222510-1"],["jmdict-1212250-1","jmdict-1222590-1"],["jmdict-1212250-1","jmdict-1222640-1"],["jmdict-1212250-1","jmdict-1317490-2"],["jmdict-1212250-1","jmdict-1360820-1"],["jmdict-1212250-1","jmdict-1391700-2"],["jmdict-1212250-1","jmdict-1391780-9"],["jmdict-1212250-1","jmdict-1420510-1"],["jmdict-1212250-1","jmdict-1542910-1"],["jmdict-1212410-1","jmdict-1356250-1"],["jmdict-1213660-1","jmdict-1214900-1"],["jmdict-1213660-1","jmdict-1252490-1"],["jmdict-1213660-1","jmdict-1257840-2"],["jmdict-1213660-1","jmdict-1291430-1"],["jmdict-1213660-1","jmdict-1312040-1"],["jmdict-1213660-1","jmdict-1342120-1"],["jmdict-1213660-1","jmdict-1590860-1"],["jmdict-1213680-1","jmdict-1252490-1"],["jmdict-1213680-1","jmdict-1327090-2"],["jmdict-1213720-2","jmdict-1326040-1"],["jmdict-1214230-1","jmdict-1326040-1"],["jmdict-1214680-1","jmdict-1590870-1"],["jmdict-1214810-1","jmdict-1260010-1"],["jmdict-1214810-1","jmdict-1274380-1"],["jmdict-1214930-1","jmdict-1226760-2"],["jmdict-1215000-1","jmdict-1440640-1"],["jmdict-1215130-2","jmdict-1337630-1"],["jmdict-1215240-1","jmdict-1227720-1"],["jmdict-1215810-1","jmdict-1254630-1"],["jmdict-1216060-1","jmdict-1254630-1"],["jmdict-1217270-1","jmdict-1217360-1"],["jmdict-1217650-1","jmdict-1257110-6"],["jmdict-1218150-1","jmdict-1313670-2"],["jmdict-1218440-1","jmdict-1406710-1"],["jmdict-1218440-1","jmdict-1406760-1"],["jmdict-1218440-1","jmdict-1455500-2"],["jmdict-1218440-1","jmdict-1484350-1"],["jmdict-1218440-1","jmdict-1587300-2"],["jmdict-1218560-1","jmdict-1218630-1"],["jmdict-1218560-2","jmdict-1218630-1"],["jmdict-1218630-1","jmdict-1236660-2"],["jmdict-1218630-1","jmdict-1519830-2"],["jmdict-1218910-1","jmdict-1220550-1"],["jmdict-1219260-1","jmdict-1326320-1"],["jmdict-1219690-1","jmdict-1403590-1"],["jmdict-1220540-1","jmdict-1220550-1"],["jmdict-1220550-1","jmdict-1220870-1"],["jmdict-1220550-1","jmdict-1220870-2"],["jmdict-1220550-1","jmdict-1220870-3"],["jmdict-1220550-1","jmdict-1221300-1"],["jmdict-1220550-1","jmdict-1221300-2"],["jmdict-1220550-1","jmdict-1222030-1"],["jmdict-1220550-1","jmdict-1222810-1"],["jmdict-1220550-1","jmdict-1316040-1"],["jmdict-1220550-1","jmdict-1468950-1"],["jmdict-1220560-2","jmdict-1526900-1"],["jmdict-1220610-2","jmdict-1526900-1"],["jmdict-1220940-1","jmdict-1222170-1"],["jmdict-1220940-2","jmdict-1222170-1"],["jmdict-1221040-1","jmdict-1306720-1"],["jmdict-1221250-1","jmdict-1221300-1"],["jmdict-1221250-1","jmdict-1293630-1"],["jmdict-1221250-1","jmdict-1500720-1"],["jmdict-1221250-1","jmdict-1535860-2"],["jmdict-1221520-6","jmdict-1540910-1"],["jmdict-1222270-1","jmdict-1222380-1"],["jmdict-1222270-2","jmdict-1222380-1"],["jmdict-1222380-1","jmdict-1222880-1"],["jmdict-1222380-1","jmdict-1375390-1"],["jmdict-1222530-1","jmdict-1540910-1"],["jmdict-1223021-1","jmdict-1223080-1"],["jmdict-1223021-1","jmdict-1223110-1"],["jmdict-1223080-1","jmdict-1223110-1"],["jmdict-1223080-1","jmdict-1257590-2"],["jmdict-1223080-1","jmdict-1356610-1"],["jmdict-1223080-1","jmdict-1458030-1"],["jmdict-1223110-1","jmdict-1257590-2"],["jmdict-1223110-1","jmdict-1356610-1"],["jmdict-1223210-1","jmdict-1351900-1"],["jmdict-1223210-1","jmdict-1489690-1"],["jmdict-1223210-1","jmdict-1497710-1"],["jmdict-1223230-1","jmdict-1264410-1"],["jmdict-1223280-1","jmdict-1490140-1"],["jmdict-1223990-1","jmdict-1551790-1"],["jmdict-1224690-1","jmdict-1319100-1"],["jmdict-1224700-1","jmdict-1319100-1"],["jmdict-1225200-2","jmdict-1321510-1"],["jmdict-1225490-1","jmdict-1225530-1"],["jmdict-1225490-1","jmdict-1225550-1"],["jmdict-1225490-1","jmdict-1225620-1"],["jmdict-1225490-1","jmdict-1225630-1"],["jmdict-1225490-1","jmdict-1486170-3"],["jmdict-1225490-1","jmdict-1536010-3"],["jmdict-1225490-1","jmdict-1586700-2"],["jmdict-1225730-1","jmdict-1403590-1"],["jmdict-1226050-1","jmdict-1254240-1"],["jmdict-1226160-1","jmdict-1505060-1"],["jmdict-1226760-2","jmdict-1274380-1"],["jmdict-1227140-1","jmdict-1531090-1"],["jmdict-1227500-1","jmdict-1228100-1"],["jmdict-1227640-1","jmdict-1227800-1"],["jmdict-1227720-1","jmdict-1227800-1"],["jmdict-1227720-1","jmdict-1424900-1"],["jmdict-1227800-1","jmdict-1434920-3"],["jmdict-1229030-1","jmdict-1327840-1"],["jmdict-1229030-1","jmdict-1344390-1"],["jmdict-1230350-2","jmdict-1310130-1"],["jmdict-1232390-1","jmdict-1318990-1"],["jmdict-1232410-1","jmdict-1318990-1"],["jmdict-1233630-2","jmdict-1362920-1"],["jmdict-1234190-1","jmdict-1244710-1"],["jmdict-1234190-1","jmdict-1402420-1"],["jmdict-1235770-1","jmdict-1378910-1"],["jmdict-1236070-1","jmdict-1236620-1"],["jmdict-1236070-2","jmdict-1236620-1"],["jmdict-1236070-6","jmdict-1236620-1"],["jmdict-1236150-1","jmdict-1600290-9"],["jmdict-1236450-1","jmdict-1236620-1"],["jmdict-1236490-2","jmdict-1236620-1"],["jmdict-1236600-1","jmdict-1236620-1"],["jmdict-1236620-1","jmdict-1262530-3"],["jmdict-1236620-1","jmdict-1283190-4"],["jmdict-1236620-1","jmdict-1362640-4"],["jmdict-1236620-1","jmdict-1362640-8"],["jmdict-1236620-1","jmdict-1379750-4"],["jmdict-1236620-1","jmdict-1392550-1"],["jmdict-1236620-1","jmdict-1469890-1"],["jmdict-1236620-1","jmdict-1469890-2"],["jmdict-1236620-1","jmdict-1469890-4"],["jmdict-1236620-1","jmdict-1469890-5"],["jmdict-1236620-1","jmdict-1555910-2"],["jmdict-1236620-1","jmdict-1588880-2"],["jmdict-1236620-1","jmdict-1600720-2"],["jmdict-1236620-1","jmdict-1602060-2"],["jmdict-1236660-1","jmdict-1540910-1"],["jmdict-1237050-1","jmdict-1308990-1"],["jmdict-1237060-1","jmdict-1359370-1"],["jmdict-1237150-3","jmdict-1330290-1"],["jmdict-1238090-1","jmdict-1238110-1"],["jmdict-1238110-1","jmdict-1566820-1"],["jmdict-1238110-1","jmdict-1630270-1"],["jmdict-1238780-2","jmdict-1250700-1"],["jmdict-1239120-1","jmdict-1557170-1"],["jmdict-1241800-2","jmdict-1328380-1"],["jmdict-1241870-1","jmdict-1330670-1"],["jmdict-1242160-1","jmdict-1242530-1"],["jmdict-1242290-1","jmdict-1242530-1"],["jmdict-1242530-1","jmdict-1331010-1"],["jmdict-1242530-1","jmdict-1331030-1"],["jmdict-1242530-1","jmdict-1331300-1"],["jmdict-1242530-1","jmdict-1496240-1"],["jmdict-1242530-1","jmdict-1512070-1"],["jmdict-1242530-1","jmdict-1512080-1"],["jmdict-1242530-1","jmdict-1584690-5"],["jmdict-1244520-1","jmdict-1397710-1"],["jmdict-1244610-1","jmdict-1469850-1"],["jmdict-1247030-1","jmdict-1335830-2"],["jmdict-1247590-1","jmdict-1344330-1"],["jmdict-1247590-1","jmdict-1558390-1"],["jmdict-1248540-1","jmdict-2067560-1"],["jmdict-1249330-1","jmdict-1505060-1"],["jmdict-1249790-1","jmdict-1252520-1"],["jmdict-1250190-1","jmdict-1543750-2"],["jmdict-1250220-1","jmdict-1250340-1"],["jmdict-1250220-2","jmdict-1250340-1"],["jmdict-1250220-4","jmdict-1250340-1"],["jmdict-1250220-6","jmdict-1250340-1"],["jmdict-1250310-1","jmdict-1250340-1"],["jmdict-1250310-2","jmdict-1250340-1"],["jmdict-1250310-3","jmdict-1250340-1"],["jmdict-1250310-4","jmdict-1250340-1"],["jmdict-1250340-1","jmdict-1250390-1"],["jmdict-1250340-1","jmdict-1307710-1"],["jmdict-1250340-1","jmdict-1307710-4"],["jmdict-1250340-1","jmdict-1319060-1"],["jmdict-1250340-1","jmdict-1403110-2"],["jmdict-1250340-1","jmdict-1409480-2"],["jmdict-1250340-1","jmdict-1429170-3"],["jmdict-1250340-1","jmdict-1590480-1"],["jmdict-1250700-1","jmdict-1327120-2"],["jmdict-1250720-1","jmdict-1406400-1"],["jmdict-1250720-1","jmdict-1406460-1"],["jmdict-1250870-1","jmdict-1440640-1"],["jmdict-1251640-1","jmdict-1465410-5"],["jmdict-1252140-1","jmdict-1303910-1"],["jmdict-1252140-2","jmdict-1360380-1"],["jmdict-1252310-1","jmdict-1252600-1"],["jmdict-1252310-1","jmdict-1252600-2"],["jmdict-1252680-1","jmdict-1337630-1"],["jmdict-1253070-1","jmdict-1253100-2"],["jmdict-1253730-2","jmdict-1505060-1"],["jmdict-1253950-1","jmdict-1254050-1"],["jmdict-1253950-1","jmdict-1254060-1"],["jmdict-1253950-1","jmdict-1254480-6"],["jmdict-1253950-1","jmdict-1255180-1"],["jmdict-1253950-1","jmdict-1418760-1"],["jmdict-1253950-1","jmdict-1460830-3"],["jmdict-1253950-1","jmdict-1461040-1"],["jmdict-1253950-1","jmdict-1493700-1"],["jmdict-1253950-1","jmdict-1548610-1"],["jmdict-1253950-1","jmdict-1580260-3"],["jmdict-1253950-1","jmdict-1606160-1"],["jmdict-1254220-1","jmdict-1254240-1"],["jmdict-1254240-1","jmdict-1330750-1"],["jmdict-1254240-1","jmdict-1602840-3"],["jmdict-1254610-1","jmdict-1333020-1"],["jmdict-1254630-1","jmdict-1254770-1"],["jmdict-1254630-1","jmdict-1254770-2"],["jmdict-1254630-1","jmdict-1559410-1"],["jmdict-1254630-1","jmdict-1559900-2"],["jmdict-1254630-1","jmdict-1559900-3"],["jmdict-1254630-1","jmdict-1570420-1"],["jmdict-1255010-1","jmdict-1333020-1"],["jmdict-1255020-1","jmdict-1333040-1"],["jmdict-1256110-1","jmdict-1256360-1"],["jmdict-1256170-2","jmdict-1256360-1"],["jmdict-1256240-1","jmdict-1256360-1"],["jmdict-1256360-1","jmdict-1580480-1"],["jmdict-1257420-1","jmdict-1257490-1"],["jmdict-1257420-1","jmdict-1279810-1"],["jmdict-1257480-1","jmdict-1257490-1"],["jmdict-1257480-1","jmdict-1279810-1"],["jmdict-1257490-1","jmdict-1279810-1"],["jmdict-1257500-1","jmdict-1279810-1"],["jmdict-1257730-1","jmdict-1260320-1"],["jmdict-1257840-2","jmdict-1312040-1"],["jmdict-1257840-2","jmdict-1360380-1"],["jmdict-1257890-1","jmdict-1360380-1"],["jmdict-1258330-4","jmdict-1529610-1"],["jmdict-1258420-1","jmdict-1403590-1"],["jmdict-1259810-1","jmdict-1318990-1"],["jmdict-1259870-1","jmdict-1440640-1"],["jmdict-1260010-1","jmdict-1312110-1"],["jmdict-1260260-1","jmdict-1260320-1"],["jmdict-1260280-1","jmdict-1260320-1"],["jmdict-1260320-1","jmdict-1335750-6"],["jmdict-1260320-1","jmdict-1372790-1"],["jmdict-1260320-1","jmdict-1437640-1"],["jmdict-1260320-1","jmdict-1561740-1"],["jmdict-1260320-1","jmdict-1561840-1"],["jmdict-1260670-6","jmdict-1329340-1"],["jmdict-1262360-1","jmdict-1304410-1"],["jmdict-1263280-1","jmdict-1434420-1"],["jmdict-1263400-1","jmdict-1366180-1"],["jmdict-1263750-1","jmdict-1314000-1"],["jmdict-1264410-1","jmdict-1302410-1"],["jmdict-1264410-1","jmdict-1339790-1"],["jmdict-1264890-1","jmdict-1366570-1"],["jmdict-1264890-1","jmdict-1367760-2"],["jmdict-1264890-1","jmdict-1546660-1"],["jmdict-1264890-1","jmdict-1593190-1"],["jmdict-1264960-1","jmdict-1366730-1"],["jmdict-1264970-1","jmdict-1304410-1"],["jmdict-1267180-3","jmdict-1310190-1"],["jmdict-1267180-4","jmdict-1481130-1"],["jmdict-1270810-5","jmdict-1319100-1"],["jmdict-1271970-1","jmdict-1334750-1"],["jmdict-1272280-1","jmdict-1588620-1"],["jmdict-1272520-1","jmdict-1274570-1"],["jmdict-1272520-1","jmdict-1516890-1"],["jmdict-1272780-2","jmdict-1273030-1"],["jmdict-1272780-5","jmdict-1312150-1"],["jmdict-1273170-1","jmdict-1274380-1"],["jmdict-1273170-2","jmdict-1274380-1"],["jmdict-1273510-1","jmdict-1274380-1"],["jmdict-1273820-1","jmdict-1274380-1"],["jmdict-1274380-1","jmdict-1312110-1"],["jmdict-1274380-1","jmdict-1347690-1"],["jmdict-1274380-1","jmdict-1368800-1"],["jmdict-1274380-1","jmdict-1373970-1"],["jmdict-1274380-1","jmdict-1376460-2"],["jmdict-1274380-1","jmdict-1428910-1"],["jmdict-1274380-1","jmdict-1489340-6"],["jmdict-1274380-1","jmdict-1523060-2"],["jmdict-1274380-1","jmdict-1605810-1"],["jmdict-1275640-4","jmdict-1366180-1"],["jmdict-1277250-1","jmdict-1277750-1"],["jmdict-1277250-1","jmdict-1353850-1"],["jmdict-1277490-1","jmdict-1519610-1"],["jmdict-1278400-1","jmdict-1594060-1"],["jmdict-1278860-1","jmdict-1481130-1"],["jmdict-1279380-1","jmdict-1514680-1"],["jmdict-1279790-1","jmdict-1279810-1"],["jmdict-1279810-1","jmdict-1321020-1"],["jmdict-1279810-1","jmdict-1321040-1"],["jmdict-1279810-1","jmdict-1416260-1"],["jmdict-1279990-1","jmdict-1280030-1"],["jmdict-1280520-2","jmdict-1280610-1"],["jmdict-1281150-1","jmdict-1360380-1"],["jmdict-1282260-1","jmdict-1330290-1"],["jmdict-1283190-2","jmdict-1283300-1"],["jmdict-1285270-1","jmdict-1285300-1"],["jmdict-1285300-1","jmdict-1437490-1"],["jmdict-1285300-1","jmdict-1512850-1"],["jmdict-1287070-1","jmdict-1369280-1"],["jmdict-1290290-1","jmdict-1326320-1"],["jmdict-1290300-1","jmdict-1515510-1"],["jmdict-1291430-1","jmdict-1312040-1"],["jmdict-1291450-1","jmdict-1360380-1"],["jmdict-1291930-1","jmdict-1401580-1"],["jmdict-1292400-1","jmdict-1500750-1"],["jmdict-1292590-1","jmdict-1500750-1"],["jmdict-1292640-2","jmdict-1481700-1"],["jmdict-1292640-2","jmdict-1500750-1"],["jmdict-1292960-4","jmdict-1481700-1"],["jmdict-1293360-1","jmdict-1500750-1"],["jmdict-1293810-1","jmdict-1333020-1"],["jmdict-1294760-1","jmdict-1447320-1"],["jmdict-1294760-1","jmdict-1489480-1"],["jmdict-1295530-2","jmdict-1333020-1"],["jmdict-1295850-1","jmdict-1476520-1"],["jmdict-1296660-1","jmdict-1534520-2"],["jmdict-1296660-1","jmdict-1534660-1"],["jmdict-1297510-1","jmdict-1297710-1"],["jmdict-1297710-1","jmdict-1427110-1"],["jmdict-1297710-1","jmdict-1487830-1"],["jmdict-1297710-1","jmdict-1561720-2"],["jmdict-1297890-1","jmdict-1422770-1"],["jmdict-1297890-1","jmdict-1451350-3"],["jmdict-1297890-1","jmdict-1594180-1"],["jmdict-1298110-1","jmdict-1337630-1"],["jmdict-1298800-1","jmdict-1500750-1"],["jmdict-1299970-1","jmdict-1579380-1"],["jmdict-1303190-1","jmdict-1528440-3"],["jmdict-1303190-1","jmdict-1559780-1"],["jmdict-1303340-1","jmdict-1483280-1"],["jmdict-1303910-1","jmdict-1303930-2"],["jmdict-1303910-1","jmdict-1382440-5"],["jmdict-1303910-1","jmdict-1596700-2"],["jmdict-1304410-1","jmdict-1455950-1"],["jmdict-1304410-1","jmdict-1523180-1"],["jmdict-1304410-1","jmdict-1590470-1"],["jmdict-1304540-1","jmdict-1556980-1"],["jmdict-1304600-1","jmdict-1556980-1"],["jmdict-1305170-1","jmdict-1504400-1"],["jmdict-1306200-1","jmdict-1546200-2"],["jmdict-1306200-1","jmdict-1546380-1"],["jmdict-1306720-1","jmdict-1411530-1"],["jmdict-1309140-1","jmdict-1453800-1"],["jmdict-1309140-1","jmdict-1516420-1"],["jmdict-1310060-1","jmdict-1342390-1"],["jmdict-1310100-1","jmdict-1328170-2"],["jmdict-1310100-1","jmdict-1344700-1"],["jmdict-1310100-1","jmdict-1360930-2"],["jmdict-1310100-1","jmdict-1374300-1"],["jmdict-1310100-1","jmdict-1426480-2"],["jmdict-1310100-1","jmdict-1472720-3"],["jmdict-1310100-1","jmdict-1496990-1"],["jmdict-1310100-1","jmdict-1537820-2"],["jmdict-1310100-1","jmdict-1554820-6"],["jmdict-1310100-1","jmdict-1590450-1"],["jmdict-1310190-1","jmdict-1323500-1"],["jmdict-1310190-1","jmdict-1352060-1"],["jmdict-1310190-1","jmdict-1397810-1"],["jmdict-1310190-1","jmdict-1397820-1"],["jmdict-1310190-1","jmdict-1460900-1"],["jmdict-1310190-1","jmdict-1509290-2"],["jmdict-1310190-1","jmdict-1519110-1"],["jmdict-1310190-1","jmdict-1519130-1"],["jmdict-1310190-1","jmdict-1593780-1"],["jmdict-1310720-1","jmdict-1310800-1"],["jmdict-1310720-1","jmdict-1310950-1"],["jmdict-1310720-2","jmdict-1310800-1"],["jmdict-1310720-2","jmdict-1310950-1"],["jmdict-1310800-1","jmdict-1310950-1"],["jmdict-1310800-1","jmdict-1492350-2"],["jmdict-1310800-1","jmdict-1518540-1"],["jmdict-1310810-1","jmdict-1342430-1"],["jmdict-1310950-1","jmdict-1406960-1"],["jmdict-1310950-1","jmdict-1518540-1"],["jmdict-1310950-1","jmdict-1529370-3"],["jmdict-1310950-1","jmdict-1589590-2"],["jmdict-1312040-1","jmdict-1342120-1"],["jmdict-1312040-1","jmdict-1590860-1"],["jmdict-1312130-1","jmdict-1440640-1"],["jmdict-1312150-1","jmdict-1604890-2"],["jmdict-1312350-1","jmdict-1360380-1"],["jmdict-1312780-1","jmdict-1329340-1"],["jmdict-1312980-1","jmdict-1422180-1"],["jmdict-1313580-3","jmdict-1356700-1"],["jmdict-1314620-1","jmdict-1351460-1"],["jmdict-1315920-3","jmdict-1330290-1"],["jmdict-1317060-1","jmdict-1318020-1"],["jmdict-1318020-1","jmdict-1318860-1"],["jmdict-1318290-1","jmdict-1341340-1"],["jmdict-1318990-1","jmdict-1516580-1"],["jmdict-1318990-1","jmdict-1595240-1"],["jmdict-1318990-1","jmdict-1601350-3"],["jmdict-1319060-1","jmdict-1328380-1"],["jmdict-1319060-2","jmdict-1319100-1"],["jmdict-1319100-1","jmdict-1557450-5"],["jmdict-1319850-1","jmdict-1533220-1"],["jmdict-1320140-1","jmdict-1471330-1"],["jmdict-1320810-2","jmdict-1328830-1"],["jmdict-1321180-1","jmdict-1401240-4"],["jmdict-1322120-1","jmdict-1322270-1"],["jmdict-1323070-1","jmdict-1515700-1"],["jmdict-1323070-1","jmdict-1557500-1"],["jmdict-1323080-1","jmdict-1323250-1"],["jmdict-1323250-1","jmdict-1600530-1"],["jmdict-1323930-1","jmdict-1590240-1"],["jmdict-1324870-1","jmdict-1494340-1"],["jmdict-1324940-1","jmdict-1326320-1"],["jmdict-1324950-2","jmdict-1326040-1"],["jmdict-1324970-1","jmdict-1326320-1"],["jmdict-1325480-2","jmdict-1401580-1"],["jmdict-1325740-2","jmdict-1401580-1"],["jmdict-1325860-1","jmdict-1326040-1"],["jmdict-1325870-1","jmdict-1415480-1"],["jmdict-1326040-1","jmdict-1329320-1"],["jmdict-1326040-1","jmdict-1343340-1"],["jmdict-1326040-1","jmdict-1429740-1"],["jmdict-1326320-1","jmdict-1328950-1"],["jmdict-1326320-1","jmdict-1365040-5"],["jmdict-1326320-1","jmdict-1414340-1"],["jmdict-1326320-1","jmdict-1522150-3"],["jmdict-1326320-1","jmdict-1801050-1"],["jmdict-1327190-6","jmdict-1328380-1"],["jmdict-1327190-9","jmdict-1513970-1"],["jmdict-1327720-1","jmdict-1343980-1"],["jmdict-1327810-1","jmdict-1342340-2"],["jmdict-1327810-1","jmdict-1517030-1"],["jmdict-1327810-1","jmdict-1552130-3"],["jmdict-1327840-1","jmdict-1328170-2"],["jmdict-1327840-1","jmdict-1344390-1"],["jmdict-1327840-1","jmdict-1554820-6"],["jmdict-1328170-2","jmdict-1344390-1"],["jmdict-1328380-1","jmdict-1328410-1"],["jmdict-1328380-1","jmdict-1454080-8"],["jmdict-1328380-1","jmdict-1516930-6"],["jmdict-1328380-1","jmdict-1517030-1"],["jmdict-1328380-1","jmdict-1517090-1"],["jmdict-1328380-1","jmdict-1517150-2"],["jmdict-1328380-1","jmdict-1594110-1"],["jmdict-1328820-1","jmdict-1328830-1"],["jmdict-1329340-1","jmdict-1423430-2"],["jmdict-1329670-1","jmdict-1329690-1"],["jmdict-1329670-1","jmdict-1330490-6"],["jmdict-1329670-1","jmdict-1465610-3"],["jmdict-1329670-1","jmdict-1473740-4"],["jmdict-1329770-1","jmdict-1554760-1"],["jmdict-1330670-1","jmdict-1538100-4"],["jmdict-1330670-1","jmdict-1587220-2"],["jmdict-1331090-1","jmdict-1341340-1"],["jmdict-1332130-1","jmdict-1514680-1"],["jmdict-1332170-1","jmdict-1332400-1"],["jmdict-1332170-1","jmdict-1346010-1"],["jmdict-1332170-1","jmdict-1514560-1"],["jmdict-1332360-2","jmdict-1505060-1"],["jmdict-1332850-2","jmdict-1333020-1"],["jmdict-1333020-1","jmdict-1383800-1"],["jmdict-1333020-1","jmdict-1508730-2"],["jmdict-1333020-1","jmdict-1524750-4"],["jmdict-1333020-1","jmdict-1524800-2"],["jmdict-1333020-1","jmdict-1525250-2"],["jmdict-1333020-1","jmdict-1531530-3"],["jmdict-1333020-1","jmdict-1535560-1"],["jmdict-1333020-1","jmdict-1553290-1"],["jmdict-1333020-1","jmdict-1589590-1"],["jmdict-1333020-1","jmdict-1591930-4"],["jmdict-1333040-1","jmdict-1375880-2"],["jmdict-1333040-1","jmdict-1419980-2"],["jmdict-1333090-2","jmdict-1499890-1"],["jmdict-1333340-1","jmdict-1457000-1"],["jmdict-1333340-1","jmdict-1638680-1"],["jmdict-1334750-1","jmdict-1592970-1"],["jmdict-1337630-1","jmdict-1386230-1"],["jmdict-1337630-1","jmdict-1434420-1"],["jmdict-1337630-1","jmdict-1538100-3"],["jmdict-1338820-1","jmdict-1444800-2"],["jmdict-1341340-1","jmdict-1552440-1"],["jmdict-1341340-1","jmdict-1552440-2"],["jmdict-1341340-1","jmdict-1555710-1"],["jmdict-1342390-1","jmdict-1419950-3"],["jmdict-1342390-1","jmdict-1422520-1"],["jmdict-1342390-1","jmdict-1426650-1"],["jmdict-1342390-1","jmdict-1532160-1"],["jmdict-1342390-1","jmdict-2022640-2"],["jmdict-1343250-1","jmdict-1513970-1"],["jmdict-1343390-1","jmdict-1513970-1"],["jmdict-1343980-1","jmdict-1505080-1"],["jmdict-1344000-2","jmdict-1426520-1"],["jmdict-1344390-1","jmdict-1554820-6"],["jmdict-1346010-1","jmdict-1512980-1"],["jmdict-1346030-1","jmdict-1512200-1"],["jmdict-1346260-1","jmdict-1357550-1"],["jmdict-1346500-1","jmdict-1349600-1"],["jmdict-1351430-1","jmdict-1403570-1"],["jmdict-1351430-1","jmdict-1436410-1"],["jmdict-1351430-1","jmdict-1483490-1"],["jmdict-1351560-2","jmdict-1505060-1"],["jmdict-1351900-1","jmdict-1489690-1"],["jmdict-1351900-1","jmdict-1497710-1"],["jmdict-1352540-2","jmdict-1500750-1"],["jmdict-1356210-1","jmdict-1356250-1"],["jmdict-1356700-1","jmdict-1464950-3"],["jmdict-1356700-1","jmdict-1499850-2"],["jmdict-1356700-1","jmdict-1545820-1"],["jmdict-1356700-1","jmdict-1595240-1"],["jmdict-1358340-1","jmdict-1358620-1"],["jmdict-1358620-1","jmdict-1358670-1"],["jmdict-1358620-1","jmdict-1956480-1"],["jmdict-1359120-1","jmdict-1360360-1"],["jmdict-1359120-1","jmdict-1381170-1"],["jmdict-1359120-1","jmdict-1394310-4"],["jmdict-1359120-1","jmdict-1426120-1"],["jmdict-1359120-1","jmdict-1426170-1"],["jmdict-1359120-1","jmdict-1580550-1"],["jmdict-1359370-1","jmdict-1359550-1"],["jmdict-1359370-1","jmdict-1470080-2"],["jmdict-1359550-1","jmdict-1362290-1"],["jmdict-1359550-1","jmdict-1470080-2"],["jmdict-1360360-1","jmdict-1360380-1"],["jmdict-1360380-1","jmdict-1478620-1"],["jmdict-1360380-1","jmdict-1490010-1"],["jmdict-1361480-1","jmdict-1361510-1"],["jmdict-1361490-1","jmdict-1361510-1"],["jmdict-1361510-1","jmdict-1431850-2"],["jmdict-1362610-1","jmdict-1414210-1"],["jmdict-1362630-1","jmdict-1497110-1"],["jmdict-1365050-2","jmdict-1365420-1"],["jmdict-1365230-1","jmdict-1365420-1"],["jmdict-1365420-1","jmdict-1365640-1"],["jmdict-1365930-1","jmdict-1467500-1"],["jmdict-1365960-1","jmdict-1366140-1"],["jmdict-1365960-1","jmdict-1366160-1"],["jmdict-1366060-1","jmdict-1366140-1"],["jmdict-1366060-3","jmdict-1366140-1"],["jmdict-1366140-1","jmdict-1366160-1"],["jmdict-1366140-1","jmdict-1366190-1"],["jmdict-1366160-1","jmdict-1366190-1"],["jmdict-1366160-1","jmdict-1477680-2"],["jmdict-1366180-1","jmdict-1465410-1"],["jmdict-1366180-1","jmdict-1466360-1"],["jmdict-1366180-1","jmdict-1582820-1"],["jmdict-1369280-1","jmdict-1528570-1"],["jmdict-1371100-1","jmdict-1371210-2"],["jmdict-1371100-1","jmdict-1604590-1"],["jmdict-1372640-1","jmdict-1549790-1"],["jmdict-1373810-2","jmdict-1543240-1"],["jmdict-1374510-1","jmdict-1514680-1"],["jmdict-1378320-1","jmdict-1399790-1"],["jmdict-1379120-1","jmdict-1481700-1"],["jmdict-1383050-2","jmdict-1449760-1"],["jmdict-1384090-2","jmdict-1440640-1"],["jmdict-1385120-1","jmdict-1504400-1"],["jmdict-1385420-1","jmdict-1385710-2"],["jmdict-1385420-1","jmdict-1543690-1"],["jmdict-1396800-1","jmdict-1522530-1"],["jmdict-1396800-1","jmdict-1592250-4"],["jmdict-1400300-1","jmdict-1430610-1"],["jmdict-1400560-1","jmdict-1505060-1"],["jmdict-1400650-1","jmdict-1505060-1"],["jmdict-1401580-1","jmdict-1414650-1"],["jmdict-1402820-1","jmdict-1442160-1"],["jmdict-1403590-1","jmdict-1591400-1"],["jmdict-1404630-6","jmdict-1588620-1"],["jmdict-1404700-2","jmdict-1495790-1"],["jmdict-1406730-1","jmdict-1512980-1"],["jmdict-1409140-3","jmdict-1409310-1"],["jmdict-1409310-1","jmdict-1508300-2"],["jmdict-1411110-1","jmdict-1590240-1"],["jmdict-1411150-1","jmdict-1590240-1"],["jmdict-1411240-1","jmdict-1590240-1"],["jmdict-1411380-2","jmdict-1450470-1"],["jmdict-1411960-1","jmdict-1512980-1"],["jmdict-1411960-1","jmdict-1514680-1"],["jmdict-1413300-1","jmdict-1413940-4"],["jmdict-1416520-1","jmdict-1450470-1"],["jmdict-1416560-2","jmdict-1544370-1"],["jmdict-1419670-2","jmdict-1504400-1"],["jmdict-1420530-1","jmdict-1554570-1"],["jmdict-1426520-1","jmdict-1589960-2"],["jmdict-1426530-2","jmdict-1546310-1"],["jmdict-1426530-3","jmdict-1546310-1"],["jmdict-1430650-1","jmdict-1514680-1"],["jmdict-1432460-1","jmdict-1449760-1"],["jmdict-1433330-1","jmdict-1442160-1"],["jmdict-1436280-2","jmdict-1505060-1"],["jmdict-1436710-1","jmdict-1514680-1"],["jmdict-1437750-1","jmdict-1472100-1"],["jmdict-1440640-1","jmdict-1535470-2"],["jmdict-1440640-1","jmdict-1551710-2"],["jmdict-1440640-1","jmdict-1604890-6"],["jmdict-1442110-1","jmdict-1442160-1"],["jmdict-1442160-1","jmdict-1442240-1"],["jmdict-1442160-1","jmdict-1477560-1"],["jmdict-1442160-1","jmdict-1482340-1"],["jmdict-1442160-1","jmdict-1516750-1"],["jmdict-1446300-1","jmdict-1557170-1"],["jmdict-1446300-2","jmdict-1557170-1"],["jmdict-1446360-1","jmdict-1557170-1"],["jmdict-1447180-1","jmdict-1477670-1"],["jmdict-1449670-1","jmdict-1449760-1"],["jmdict-1449760-1","jmdict-1496170-1"],["jmdict-1453270-1","jmdict-1478400-1"],["jmdict-1453270-1","jmdict-1539980-2"],["jmdict-1456040-3","jmdict-1504400-1"],["jmdict-1463770-4","jmdict-1526900-1"],["jmdict-1464300-1","jmdict-1543240-1"],["jmdict-1469850-1","jmdict-1540910-1"],["jmdict-1471380-1","jmdict-1565770-1"],["jmdict-1473190-1","jmdict-1504090-1"],["jmdict-1474110-1","jmdict-1512980-1"],["jmdict-1477210-1","jmdict-1477220-1"],["jmdict-1477560-1","jmdict-1477670-1"],["jmdict-1477660-3","jmdict-1477670-1"],["jmdict-1477670-1","jmdict-1542380-1"],["jmdict-1480670-1","jmdict-1481130-1"],["jmdict-1481130-1","jmdict-1494700-1"],["jmdict-1481300-1","jmdict-1588620-1"],["jmdict-1481700-1","jmdict-1501440-1"],["jmdict-1484240-1","jmdict-1533220-1"],["jmdict-1491150-1","jmdict-1540910-1"],["jmdict-1492410-1","jmdict-1550120-1"],["jmdict-1492970-1","jmdict-1550120-1"],["jmdict-1493830-1","jmdict-1538690-1"],["jmdict-1494620-1","jmdict-1529610-1"],["jmdict-1494880-2","jmdict-1550120-1"],["jmdict-1495460-1","jmdict-1505060-1"],["jmdict-1495790-1","jmdict-1495990-1"],["jmdict-1499180-1","jmdict-1499220-1"],["jmdict-1499180-1","jmdict-1546880-1"],["jmdict-1499180-1","jmdict-1956920-1"],["jmdict-1499650-2","jmdict-1557170-1"],["jmdict-1500750-1","jmdict-1500770-1"],["jmdict-1500750-1","jmdict-1551430-1"],["jmdict-1500750-1","jmdict-1617560-1"],["jmdict-1504090-1","jmdict-1504160-1"],["jmdict-1504190-1","jmdict-1554570-1"],["jmdict-1504370-1","jmdict-1504400-1"],["jmdict-1504400-1","jmdict-1509490-1"],["jmdict-1504400-1","jmdict-1509490-2"],["jmdict-1504400-1","jmdict-1550930-1"],["jmdict-1504400-1","jmdict-1577280-4"],["jmdict-1505060-1","jmdict-1523830-3"],["jmdict-1505060-1","jmdict-1536010-4"],["jmdict-1505060-1","jmdict-1561760-1"],["jmdict-1507180-1","jmdict-1529760-1"],["jmdict-1510940-1","jmdict-1511180-1"],["jmdict-1510950-1","jmdict-1511180-1"],["jmdict-1510980-1","jmdict-1511180-1"],["jmdict-1511180-1","jmdict-1511350-1"],["jmdict-1511180-1","jmdict-1511350-5"],["jmdict-1511180-1","jmdict-1512240-1"],["jmdict-1512200-1","jmdict-1512210-1"],["jmdict-1512200-1","jmdict-1902520-1"],["jmdict-1513530-2","jmdict-1513910-1"],["jmdict-1513910-1","jmdict-1513940-1"],["jmdict-1513970-1","jmdict-1540940-2"],["jmdict-1514650-1","jmdict-1514680-1"],["jmdict-1514680-1","jmdict-1690280-1"],["jmdict-1516750-1","jmdict-1543240-1"],["jmdict-1517220-1","jmdict-1550120-1"],["jmdict-1518120-1","jmdict-1533440-1"],["jmdict-1528440-3","jmdict-1559780-1"],["jmdict-1529610-1","jmdict-1529650-1"],["jmdict-1529610-1","jmdict-1530940-1"],["jmdict-1529610-1","jmdict-1544090-2"],["jmdict-1529610-1","jmdict-1602900-1"],["jmdict-1529760-1","jmdict-1557150-1"],["jmdict-1529760-1","jmdict-1576630-4"],["jmdict-1533440-1","jmdict-1548280-1"],["jmdict-1534340-2","jmdict-1550120-1"],["jmdict-1538690-1","jmdict-1633900-1"],["jmdict-1538850-1","jmdict-1588620-1"],["jmdict-1540910-1","jmdict-1591130-1"],["jmdict-1542600-1","jmdict-1590240-1"],["jmdict-1542930-1","jmdict-1543220-1"],["jmdict-1543130-1","jmdict-1543220-1"],["jmdict-1543200-1","jmdict-1543220-1"],["jmdict-1543220-1","jmdict-1543630-1"],["jmdict-1546310-1","jmdict-1836130-1"],["jmdict-1549550-1","jmdict-1549790-1"],["jmdict-1549550-2","jmdict-1549790-1"],["jmdict-1550120-1","jmdict-1601260-2"],["jmdict-1550120-1","jmdict-1612910-1"],["jmdict-1550190-2","jmdict-1550410-1"],["jmdict-1550410-1","jmdict-1550670-1"],["jmdict-1550410-1","jmdict-2147990-2"],["jmdict-1556980-1","jmdict-1602060-1"],["jmdict-1584900-1","jmdict-1590240-1"],["jmdict-1779760-1","jmdict-1956700-1"]].map(([a,b]) => a < b ? `${a}|${b}` : `${b}|${a}`));
function kotobaIsExcludedDistractorPair(a,b){
  const first = String(a||''), second = String(b||'');
  return KOTOBA_QUIZ_EXCLUDED_PAIRS.has(first < second ? `${first}|${second}` : `${second}|${first}`);
}


/* src/topics.js */
const TOPICS = [
  ['cibo_bevande', 'Cibo e bevande'],
  ['casa', 'Casa'],
  ['famiglia_persone', 'Famiglia e persone'],
  ['scuola_studio', 'Scuola e studio'],
  ['lavoro', 'Lavoro'],
  ['viaggi', 'Viaggi'],
  ['trasporti', 'Trasporti'],
  ['citta_luoghi', 'Città e luoghi'],
  ['shopping_denaro', 'Shopping e denaro'],
  ['corpo', 'Corpo'],
  ['salute', 'Salute'],
  ['azioni_quotidiane', 'Azioni quotidiane'],
  ['emozioni', 'Emozioni'],
  ['natura', 'Natura'],
  ['animali', 'Animali'],
  ['tempo_atmosferico', 'Tempo atmosferico'],
  ['giorni_mesi_tempo', 'Giorni, mesi e tempo'],
  ['numeri_quantita', 'Numeri e quantità'],
  ['verbi_comuni', 'Verbi comuni'],
  ['aggettivi_comuni', 'Aggettivi comuni'],
  ['oggetti_quotidiani', 'Oggetti quotidiani'],
  ['scienza_matematica', 'Scienza e matematica'],
  ['tecnologia_informatica', 'Tecnologia e informatica'],
  ['societa_diritto', 'Società e diritto'],
  ['arte_cultura', 'Arte e cultura'],
  ['storia_religione', 'Storia e religione'],
  ['sport_giochi', 'Sport e giochi'],
  ['freedict_completo', 'Vocabolario completo']
].map(([id, label]) => ({ id, label }));

const topicLabel = id => TOPICS.find(t => t.id === id)?.label ?? id;

const STUDY_LEVELS = ['ESSENTIAL', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
const STUDY_LEVEL_META = {
  ESSENTIAL: { label: 'Essenziale', reference: 'circa N5', legacyJlpt: 'N5' },
  BASIC: { label: 'Base', reference: 'circa N4', legacyJlpt: 'N4' },
  INTERMEDIATE: { label: 'Intermedio', reference: 'circa N3', legacyJlpt: 'N3' },
  ADVANCED: { label: 'Avanzato', reference: 'circa N2', legacyJlpt: 'N2' },
  EXPERT: { label: 'Esperto', reference: 'circa N1', legacyJlpt: 'N1' }
};
const LEGACY_JLPT_TO_STUDY_LEVEL = { N5: 'ESSENTIAL', N4: 'BASIC', N3: 'INTERMEDIATE', N2: 'ADVANCED', N1: 'EXPERT' };
const normalizedStudyLevel = level => STUDY_LEVELS.includes(level) ? level : 'BASIC';
const studyLevelRank = level => {
  const rank = STUDY_LEVELS.indexOf(level);
  return rank >= 0 ? rank : Number.POSITIVE_INFINITY;
};
const legacyJlptToStudyLevel = level => LEGACY_JLPT_TO_STUDY_LEVEL[level] || 'BASIC';
const studyLevelToLegacyJlpt = level => STUDY_LEVEL_META[normalizedStudyLevel(level)].legacyJlpt;
const studyLevelLabel = level => STUDY_LEVEL_META[normalizedStudyLevel(level)].label;
const studyLevelReference = level => STUDY_LEVEL_META[normalizedStudyLevel(level)].reference;
const studyLevelChoiceLabel = level => `${studyLevelLabel(level)} (${studyLevelReference(level)})`;
const vocabularyStudyLevel = vocab => STUDY_LEVELS.includes(vocab?.studyLevel) ? vocab.studyLevel : null;



/* src/persistence.js */
const STORAGE_KEY = 'nihongo-vocab-mvp-state-v1';

const defaultDirectionProgress = () => ({
  masteryScore: 0,
  level: 'Nuovo',
  correctCount: 0,
  wrongCount: 0,
  almostCount: 0,
  correctStreak: 0,
  lastReviewedAt: null,
  nextReviewAt: null,
  intervalDays: 0,
  dailyLastReviewedAt: null,
  dailyNextReviewAt: null,
  dailyIntervalDays: 0,
  reviewDays: []
});

const defaultState = () => ({
  version: 1,
  onboardingComplete: false,
  settings: {
    newPerDay: 10,
    exerciseMode: 'adaptive',
    dailyGoalMinutes: 10,
    maxMinutes: 10,
    studyLevel: 'BASIC',
    jlptLevel: 'N4',
    selectedTopics: [],
    // 3.1.8 controls; the old 'newPerDay' value remains as a migration anchor.
    dailyBalance: 2,
    dailyNewLimit: null,
    freeExercises: 20,
    freeNew: 4
  },
  progress: {},
  answers: [],
  sessions: [],
  activeSession: null,
  excludedVocabulary: {},
  sensePriorityUnlocks: {}
});

function loadState() {
  try {
    const raw = window.__KOTOBA_BOOT_MAIN__ || localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const oldSettings = parsed.settings || {};
    const mergedSettings = { ...defaultState().settings, ...oldSettings };
    if (!Object.prototype.hasOwnProperty.call(oldSettings, 'dailyNewLimit')) {
      // Respect a previous explicit daily cap but hide it as an advanced option.
      mergedSettings.dailyNewLimit = Object.prototype.hasOwnProperty.call(oldSettings, 'newPerDay')
        ? Math.max(0, Math.min(200, Math.floor(Number(oldSettings.newPerDay) || 0))) : null;
    }
    mergedSettings.dailyNewLimit = mergedSettings.dailyNewLimit == null ? null
      : Math.max(0, Math.min(200, Math.floor(Number(mergedSettings.dailyNewLimit) || 0)));
    mergedSettings.dailyBalance = Number.isInteger(Number(mergedSettings.dailyBalance))
      && Number(mergedSettings.dailyBalance) >= 0 && Number(mergedSettings.dailyBalance) <= 4
      ? Number(mergedSettings.dailyBalance) : 2;
    mergedSettings.freeExercises = Math.max(10, Math.min(60, Math.round((Number(mergedSettings.freeExercises) || 20) / 5) * 5));
    mergedSettings.freeNew = Math.max(0, Math.min(Math.floor(mergedSettings.freeExercises / 2), Math.floor(Number(mergedSettings.freeNew) || 0)));
    if (!Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'dailyGoalMinutes')) {
      mergedSettings.dailyGoalMinutes = Math.max(1, Number(parsed.settings?.maxMinutes || 10));
    }
    // 3.1.5 migration: the old N5-N1 preference is only an orientation source.
    // Vocabulary selection is driven by the reviewed per-sense studyLevel field.
    if (!Object.prototype.hasOwnProperty.call(parsed.settings || {}, 'studyLevel')) {
      mergedSettings.studyLevel = legacyJlptToStudyLevel(parsed.settings?.jlptLevel || mergedSettings.jlptLevel);
    }
    mergedSettings.studyLevel = normalizedStudyLevel(mergedSettings.studyLevel);
    mergedSettings.jlptLevel = studyLevelToLegacyJlpt(mergedSettings.studyLevel);
    mergedSettings.exerciseMode = 'adaptive';
    return {
      ...defaultState(),
      ...parsed,
      settings: mergedSettings,
      progress: parsed.progress || {},
      answers: Array.isArray(parsed.answers) ? parsed.answers : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      activeSession: parsed.activeSession && Array.isArray(parsed.activeSession.items) ? parsed.activeSession : null,
      excludedVocabulary: parsed.excludedVocabulary && typeof parsed.excludedVocabulary === 'object' ? parsed.excludedVocabulary : {},
      sensePriorityUnlocks: parsed.sensePriorityUnlocks && typeof parsed.sensePriorityUnlocks === 'object' ? parsed.sensePriorityUnlocks : {}
    };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  const compact = {
    ...state,
    answers: state.answers.slice(-5000),
    sessions: state.sessions.slice(-365)
  };
  const adapter=window.__KOTOBA_IDB_API__;
  if(adapter){adapter.put('main',compact).catch(e=>{
    console.error('Kotoba IndexedDB write failed:',e);
    const status=document.querySelector('#kotoba-storage-error');
    if(status)status.textContent='Errore salvataggio locale: esporta subito i progressi.';
  });}
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('kotoba-kana-practice-v1');
  if(window.__KOTOBA_IDB_API__){window.__KOTOBA_IDB_API__.remove('main');window.__KOTOBA_IDB_API__.remove('kana');}
  return defaultState();
}

function isVocabularyExcluded(state, vocabularyId) {
  return Boolean(state?.excludedVocabulary?.[vocabularyId]);
}

function excludeVocabularyFromStudy(state, vocabularyId, now = new Date()) {
  state.excludedVocabulary = state.excludedVocabulary || {};
  state.excludedVocabulary[vocabularyId] = { excludedAt: new Date(now).toISOString() };
}

function restoreVocabularyToStudy(state, vocabularyId) {
  if (!state.excludedVocabulary) return;
  delete state.excludedVocabulary[vocabularyId];
}

function ensureVocabularyProgress(state, vocabularyId, introducedAt = null) {
  if (!state.progress[vocabularyId]) {
    state.progress[vocabularyId] = {
      introducedAt,
      itToJp: defaultDirectionProgress(),
      jpToIt: defaultDirectionProgress()
    };
  } else if (introducedAt && !state.progress[vocabularyId].introducedAt) {
    state.progress[vocabularyId].introducedAt = introducedAt;
  }
  return state.progress[vocabularyId];
}


function isMergedSense(vocab) {
  return Boolean(vocab?.mergedIntoSenseId);
}

function effectiveLearningSense(vocab) {
  if (!vocab) return null;
  return vocab.mergedIntoSenseId ? (embeddedVocabularyById.get(vocab.mergedIntoSenseId) || null) : vocab;
}

function isActiveStudySense(vocab) {
  return Boolean(vocab && vocab.studyEnabled !== false && !vocab.aliasOf && !isMergedSense(vocab));
}

function sensePriorityRank(vocab) {
  return Number(vocab?.sensePriorityRank ?? vocab?.senseRankWithinEntry ?? vocab?.jmdictSenseIndex ?? 999);
}

function directionIsConsolidated(progress) {
  return levelRank(levelFromProgress(progress || defaultDirectionProgress())) >= levelRank('Quasi appreso');
}

function progressIsConsolidated(progress) {
  return Boolean(progress?.introducedAt && directionIsConsolidated(progress.itToJp) && directionIsConsolidated(progress.jpToIt));
}

function refreshSensePriorityUnlock(state, vocabularyId, now = new Date()) {
  state.sensePriorityUnlocks = state.sensePriorityUnlocks || {};
  if (state.sensePriorityUnlocks[vocabularyId]) return true;
  const progress = state.progress?.[vocabularyId];
  if (!progressIsConsolidated(progress)) return false;
  state.sensePriorityUnlocks[vocabularyId] = new Date(now).toISOString();
  return true;
}

function isSensePriorityUnlocked(state, vocabularyId) {
  if (state.sensePriorityUnlocks?.[vocabularyId]) return true;
  return refreshSensePriorityUnlock(state, vocabularyId);
}

function mergeVocabularyProgressRecords(leftRecord, rightRecord) {
  if (!leftRecord) return rightRecord ? JSON.parse(JSON.stringify(rightRecord)) : null;
  if (!rightRecord) return JSON.parse(JSON.stringify(leftRecord));
  const introducedCandidates = [leftRecord.introducedAt, rightRecord.introducedAt].filter(Boolean).sort();
  return {
    ...leftRecord,
    introducedAt: introducedCandidates[0] || null,
    introducedDayKey: leftRecord.introducedDayKey || rightRecord.introducedDayKey || null,
    introducedDailyDayKey: [leftRecord.introducedDailyDayKey, rightRecord.introducedDailyDayKey].filter(Boolean).sort().pop() || null,
    itToJp: mergeDirectionProgressForAlias(leftRecord.itToJp, rightRecord.itToJp),
    jpToIt: mergeDirectionProgressForAlias(leftRecord.jpToIt, rightRecord.jpToIt)
  };
}

function directSenseIntroductionAllowed(state, vocab) {
  if (!vocab || !isActiveStudySense(vocab) || isVocabularyExcluded(state, vocab.id)) return false;
  for (const prerequisiteId of (vocab.prerequisiteSenseIds || [])) {
    if (isVocabularyExcluded(state, prerequisiteId)) return false;
    if (!state.progress?.[prerequisiteId]?.introducedAt) return false;
    if (!isSensePriorityUnlocked(state, prerequisiteId)) return false;
  }
  return true;
}

function migrateSensePriorityState(state) {
  state.progress = state.progress || {};
  state.sensePriorityUnlocks = state.sensePriorityUnlocks || {};
  state.dataMigrations = state.dataMigrations || {};
  if (state.dataMigrations.sensePriority314) {
    // Keep the monotonic unlock cache fresh for progress imported from another device/version.
    for (const [id, progress] of Object.entries(state.progress)) if (progressIsConsolidated(progress)) refreshSensePriorityUnlock(state, id);
    return state;
  }

  const mergedSenses = (EMBEDDED_VOCABULARY.entries || []).filter(v => v.mergedIntoSenseId);
  for (const merged of mergedSenses) {
    const targetId = merged.mergedIntoSenseId;
    const sourceProgress = state.progress[merged.id];
    if (sourceProgress) {
      state.progress[targetId] = mergeVocabularyProgressRecords(state.progress[targetId], sourceProgress);
      delete state.progress[merged.id];
    }
    if (state.sensePriorityUnlocks[merged.id] && !state.sensePriorityUnlocks[targetId]) {
      state.sensePriorityUnlocks[targetId] = state.sensePriorityUnlocks[merged.id];
    }
    delete state.sensePriorityUnlocks[merged.id];
  }

  for (const [id, progress] of Object.entries(state.progress)) {
    if (progressIsConsolidated(progress)) refreshSensePriorityUnlock(state, id);
  }

  // A session created by 3.1.3 may contain a secondary sense before its new
  // prerequisites. Preserve completed work, but remove unsafe remaining new
  // items and merged senses. The next session will select the proper prerequisite.
  if (state.activeSession?.items) {
    const saved = state.activeSession;
    const oldItems = saved.items;
    const oldIndex = Math.max(0, Number(saved.index || 0));
    const keep = [];
    let newIndex = 0;
    let currentRemoved = false;
    for (let i = 0; i < oldItems.length; i++) {
      const item = oldItems[i];
      if (i < oldIndex) { keep.push(item); newIndex++; continue; }
      if (!item?.vocabularyId) { keep.push(item); continue; }
      const vocab = embeddedVocabularyById.get(item.vocabularyId);
      let allowed = Boolean(vocab) && !isMergedSense(vocab) && vocab.studyEnabled !== false && !isVocabularyExcluded(state, vocab.id);
      const isNewItem = item.type === 'learn' || item.source === 'new' || item.source === 'extra-new';
      if (allowed && isNewItem && !state.progress?.[vocab.id]?.introducedAt) allowed = directSenseIntroductionAllowed(state, vocab);
      if (allowed) keep.push(item);
      else if (i === oldIndex) currentRemoved = true;
    }
    saved.items = keep;
    saved.index = Math.min(newIndex, keep.length);
    if (currentRemoved) { saved.feedback = null; saved.selectedOption = null; saved.currentQuestionElapsedMs = 0; }
    saved.newSeen = (saved.newSeen || []).filter(id => !isMergedSense(embeddedVocabularyById.get(id)));
    if (!saved.items.length) state.activeSession = null;
  }

  state.dataMigrations.sensePriority314 = true;
  return state;
}


function equivalentAliasMap() {
  const out = {};
  Object.assign(out,window.__KOTOBA_LEGACY_COMPAT__?.aliases||{});
  for (const entry of (EMBEDDED_VOCABULARY.entries || [])) {
    if (entry.aliasOf) out[entry.id] = entry.aliasOf;
  }
  return out;
}

function mergeDirectionProgressForAlias(a, b) {
  if (!a) return { ...defaultDirectionProgress(), ...(b || {}), reviewDays: [...(b?.reviewDays || [])] };
  if (!b) return { ...defaultDirectionProgress(), ...a, reviewDays: [...(a.reviewDays || [])] };
  const left = { ...defaultDirectionProgress(), ...(a || {}) };
  const right = { ...defaultDirectionProgress(), ...(b || {}) };
  const dates = value => value ? new Date(value).getTime() : null;
  const latest = (x, y) => {
    if (!x) return y || null;
    if (!y) return x || null;
    return dates(x) >= dates(y) ? x : y;
  };
  const earliest = (x, y) => {
    if (!x) return y || null;
    if (!y) return x || null;
    return dates(x) <= dates(y) ? x : y;
  };
  const reviewDays = [...new Set([...(left.reviewDays || []), ...(right.reviewDays || [])])].sort();
  const merged = {
    masteryScore: Math.max(left.masteryScore || 0, right.masteryScore || 0),
    level: 'Nuovo',
    correctCount: (left.correctCount || 0) + (right.correctCount || 0),
    wrongCount: (left.wrongCount || 0) + (right.wrongCount || 0),
    almostCount: (left.almostCount || 0) + (right.almostCount || 0),
    correctStreak: Math.max(left.correctStreak || 0, right.correctStreak || 0),
    lastReviewedAt: latest(left.lastReviewedAt, right.lastReviewedAt),
    nextReviewAt: earliest(left.nextReviewAt, right.nextReviewAt),
    intervalDays: Math.min(
      Number.isFinite(Number(left.intervalDays)) ? Number(left.intervalDays) : 0,
      Number.isFinite(Number(right.intervalDays)) ? Number(right.intervalDays) : 0
    ),
    dailyLastReviewedAt: latest(left.dailyLastReviewedAt, right.dailyLastReviewedAt),
    dailyNextReviewAt: earliest(left.dailyNextReviewAt, right.dailyNextReviewAt),
    dailyIntervalDays: Math.min(
      Number.isFinite(Number(left.dailyIntervalDays)) ? Number(left.dailyIntervalDays) : 0,
      Number.isFinite(Number(right.dailyIntervalDays)) ? Number(right.dailyIntervalDays) : 0
    ),
    reviewDays
  };
  const strongest = right.masteryScore > left.masteryScore ? right : left;
  if (strongest.selfAssessed === true) {
    merged.selfAssessed = true;
    merged.selfAssessedAt = strongest.selfAssessedAt || null;
  }
  merged.level = levelFromProgress(merged);
  return merged;
}

function migrateEquivalentVocabularyState(inputState) {
  const state = inputState || defaultState();
  state.progress = state.progress || {};
  state.dataMigrations = state.dataMigrations || {};
  const reconcileLexiconSession = !state.dataMigrations.lexiconSession310;
  if (reconcileLexiconSession && state.activeSession) {
    state.lexiconMigrationPausedSession = JSON.parse(JSON.stringify(state.activeSession));
  }
  const aliases = equivalentAliasMap();
  let changed = false;
  for (const [aliasId, canonicalId] of Object.entries(aliases)) {
    const alias = state.progress[aliasId];
    if (!alias) continue;
    const canonical = state.progress[canonicalId];
    if (!canonical) {
      state.progress[canonicalId] = alias;
    } else {
      const introducedCandidates = [canonical.introducedAt, alias.introducedAt].filter(Boolean).sort();
      state.progress[canonicalId] = {
        ...canonical,
        introducedAt: introducedCandidates[0] || null,
        introducedDayKey: canonical.introducedDayKey || alias.introducedDayKey || null,
        introducedDailyDayKey: [canonical.introducedDailyDayKey, alias.introducedDailyDayKey].filter(Boolean).sort().pop() || null,
        itToJp: mergeDirectionProgressForAlias(canonical.itToJp, alias.itToJp),
        jpToIt: mergeDirectionProgressForAlias(canonical.jpToIt, alias.jpToIt)
      };
    }
    delete state.progress[aliasId];
    changed = true;
  }
  if (Array.isArray(state.answers)) {
    for (const answer of state.answers) {
      if (aliases[answer.vocabularyId]) {
        answer.vocabularyId = aliases[answer.vocabularyId];
        changed = true;
      }
    }
  }
  if (state.excludedVocabulary) {
    for (const [aliasId, canonicalId] of Object.entries(aliases)) {
      const excluded = state.excludedVocabulary[aliasId];
      if (!excluded) continue;
      if (!state.excludedVocabulary[canonicalId]) state.excludedVocabulary[canonicalId] = excluded;
      delete state.excludedVocabulary[aliasId];
      changed = true;
    }
  }
  if (state.activeSession?.items) {
    for (const item of state.activeSession.items) {
      if (item?.vocabularyId && aliases[item.vocabularyId]) {
        item.vocabularyId = aliases[item.vocabularyId];
        changed = true;
      }
    }
    if (Array.isArray(state.activeSession.newSeen)) {
      state.activeSession.newSeen = [...new Set(state.activeSession.newSeen.map(id => aliases[id] || id))];
    }
  }
  state.dataMigrations = state.dataMigrations || {};
  if (!state.dataMigrations.equivalentTranslations241 || changed) {
    state.dataMigrations.equivalentTranslations241 = true;
  }
  // 2.7.0 removes proper names of cities/states from the lexical dataset.
  // Purge orphan per-word state while preserving session-time/streak history.
  const validIds = new Set((EMBEDDED_VOCABULARY.entries || []).map(entry => entry.id));
  for(const id of Object.keys(aliases))validIds.add(id);
  for(const id of (window.__KOTOBA_LEGACY_COMPAT__?.legacyIds||[]))validIds.add(id);
  // Preserve unknown historic IDs in progress, answers and exclusions rather than
  // deleting learner achievements during lexicon optimization. They are inert:
  // only canonical study-enabled words participate in future sessions.
  state.unresolvedLegacyIds=[...new Set([
    ...Object.keys(state.progress||{}),
    ...Object.keys(state.excludedVocabulary||{})
  ].filter(id=>!validIds.has(id)))];
  if (state.activeSession?.items) {
    const saved=state.activeSession;
    const oldIndex=Math.max(0,Number(saved.index||0));
    const kept=[];let newIndex=0;
    for(let i=0;i<saved.items.length;i++){
      const item=saved.items[i],eligible=!item?.vocabularyId || Boolean(embeddedVocabularyById.get(item.vocabularyId));
      if(eligible){kept.push(item);if(i<oldIndex)newIndex++;}
    }
    saved.items=kept;saved.index=Math.min(newIndex,kept.length);
    if(!kept.length)state.activeSession=null;
  }
  state.dataMigrations.properPlaces270 = true;
  if (reconcileLexiconSession && state.activeSession?.items) {
    const saved = state.activeSession;
    const entries = new Map(EMBEDDED_VOCABULARY.entries.map(v => [v.id, v]));
    const usable = item => entries.get(item?.vocabularyId)?.studyEnabled !== false && entries.has(item?.vocabularyId) && !isVocabularyExcluded(state, item.vocabularyId);
    const oldIndex = saved.index;
    const currentRemoved = !usable(saved.items[oldIndex]);
    saved.index = saved.items.slice(0, oldIndex).filter(usable).length;
    saved.items = saved.items.filter(usable);
    for (let i = saved.index; i < saved.items.length; i++) {
      const item = saved.items[i], entry = entries.get(item.vocabularyId);
      if (item.type !== 'question') continue;
      if (item.direction === 'itToJp' && ![...(entry.italian || []), ...(entry.alternativeItalian || [])].includes(item.italianPrompt)) item.italianPrompt = entry.italian[0];
      if (item.exerciseType === 'mc') item.options = null;
    }
    if (currentRemoved) { saved.feedback = null; saved.selectedOption = null; saved.currentQuestionElapsedMs = 0; }
    else if (!saved.feedback) saved.selectedOption = null;
    if (!saved.items.length) {
      state.sessions = state.sessions || [];
      state.sessions.push({
        startedAt: saved.startedAt || new Date().toISOString(), completedAt: new Date().toISOString(),
        mode: 'migration-interrupted', durationSeconds: Object.values(saved.studySecondsByDate || {}).reduce((sum, value) => sum + Number(value || 0), 0),
        studySecondsByDate: { ...(saved.studySecondsByDate || {}) },
        answers: saved.answers || 0, correct: saved.counts?.correct || 0, almost: saved.counts?.almost || 0, wrong: saved.counts?.wrong || 0,
        newCount: (saved.newSeen || []).length, levelsUp: saved.levelsUp || 0
      });
      state.activeSession = null;
    }
  }
  state.dataMigrations.lexiconSession310 = true;
  migrateIndependentDailyReviewSchedule(state);
  migrateSensePriorityState(state);
  return state;
}

function answerProgressDelta(answer) {
  if (!answer) return 0;
  if (answer.result === 'correct') return answer.exerciseType === 'free' ? 12 : 8;
  if (answer.result === 'almost') return 3;
  return answer.result === 'wrong' ? -15 : 0;
}

function sessionModeAtTimestamp(state, timestamp) {
  const t = new Date(timestamp).getTime();
  if (!Number.isFinite(t)) return null;
  const explicit = (state.sessions || []).find(session => {
    const start = new Date(session.startedAt).getTime();
    const end = new Date(session.completedAt).getTime();
    return Number.isFinite(start) && Number.isFinite(end) && t >= start - 1000 && t <= end + 5000;
  });
  if (explicit) return explicit.mode || 'daily';
  const active = state.activeSession;
  if (active?.startedAt) {
    const start = new Date(active.startedAt).getTime();
    if (Number.isFinite(start) && t >= start - 1000) return active.mode || 'daily';
  }
  return null;
}

function nextLocalMidnightIso(input = new Date()) {
  const d = new Date(input);
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
  return next.toISOString();
}

function migrateIndependentDailyReviewSchedule(state) {
  state.dataMigrations = state.dataMigrations || {};
  if (state.dataMigrations.independentDailySchedule284) return state;
  const answers = Array.isArray(state.answers) ? state.answers : [];
  for (const [vocabularyId, vp] of Object.entries(state.progress || {})) {
    if (!vp?.introducedAt) continue;
    for (const direction of ['itToJp', 'jpToIt']) {
      const p = vp[direction] || defaultDirectionProgress();
      if (p.dailyNextReviewAt || p.dailyLastReviewedAt) continue;
      const relevant = answers
        .filter(a => a.vocabularyId === vocabularyId && a.direction === direction && a.timestamp)
        .map(a => ({ ...a, inferredMode: a.sessionMode || sessionModeAtTimestamp(state, a.timestamp) }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      let dailyIndex = -1;
      for (let i = relevant.length - 1; i >= 0; i--) {
        if (relevant[i].inferredMode === 'daily') { dailyIndex = i; break; }
      }
      if (dailyIndex >= 0) {
        const dailyAnswer = relevant[dailyIndex];
        const after = relevant.slice(dailyIndex + 1);
        // If no free session followed the daily answer, the legacy schedule is still exact.
        if (!after.length && p.nextReviewAt) {
          p.dailyLastReviewedAt = p.lastReviewedAt || dailyAnswer.timestamp;
          p.dailyNextReviewAt = p.nextReviewAt;
          p.dailyIntervalDays = Number(p.intervalDays || 0);
        } else {
          const laterDelta = after.reduce((sum, a) => sum + answerProgressDelta(a), 0);
          const scoreAtDaily = Math.max(0, Math.min(100, Number(p.masteryScore || 0) - laterDelta));
          const uptoDaily = relevant.slice(0, dailyIndex + 1);
          let streak = 0;
          for (let i = uptoDaily.length - 1; i >= 0; i--) {
            if (uptoDaily[i].result !== 'correct') break;
            streak += 1;
          }
          const dailyDay = localDateKey(dailyAnswer.timestamp);
          const reviewDays = [...new Set([
            ...(p.reviewDays || []).filter(day => day <= dailyDay),
            ...uptoDaily.map(a => localDateKey(a.timestamp))
          ])].sort();
          const reconstructed = { ...p, masteryScore: scoreAtDaily, correctStreak: streak, reviewDays };
          const interval = intervalFor(reconstructed, dailyAnswer.result);
          p.dailyLastReviewedAt = dailyAnswer.timestamp;
          p.dailyIntervalDays = interval;
          p.dailyNextReviewAt = new Date(new Date(dailyAnswer.timestamp).getTime() + interval * 86400000).toISOString();
        }
      } else {
        // Vocabulary introduced only through free study enters the daily SRS on the next local day.
        p.dailyLastReviewedAt = null;
        p.dailyIntervalDays = 1;
        p.dailyNextReviewAt = nextLocalMidnightIso(vp.introducedAt || p.lastReviewedAt || new Date());
      }
      vp[direction] = p;
    }
  }
  state.dataMigrations.independentDailySchedule284 = true;
  return state;
}



/* src/srs.js */
const LEVELS = [
  'Nuovo',
  'In apprendimento',
  'In consolidamento',
  'Quasi appreso',
  'Appreso',
  'Padroneggiato'
];

const levelRank = level => Math.max(0, LEVELS.indexOf(level));

function scoreLevel(score) {
  if (score <= 14) return 'Nuovo';
  if (score <= 34) return 'In apprendimento';
  if (score <= 54) return 'In consolidamento';
  if (score <= 74) return 'Quasi appreso';
  if (score <= 89) return 'Appreso';
  return 'Padroneggiato';
}

function localDateKey(input = new Date()) {
  const d = new Date(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function levelFromProgress(progress) {
  if (progress?.selfAssessed === true) return scoreLevel(progress.masteryScore);
  const uniqueDays = new Set(progress.reviewDays || []).size;
  let cappedScore = progress.masteryScore;
  if (uniqueDays < 2) cappedScore = Math.min(cappedScore, 54);
  else if (uniqueDays < 4) cappedScore = Math.min(cappedScore, 74);
  else if (uniqueDays < 6) cappedScore = Math.min(cappedScore, 89);
  return scoreLevel(cappedScore);
}

const SELF_ASSESSMENT_LEVELS = [
  'In apprendimento',
  'In consolidamento',
  'Quasi appreso',
  'Appreso',
  'Padroneggiato'
];

const SELF_ASSESSMENT_CONFIG = {
  'In apprendimento': { score: 25, intervalDays: 1 },
  'In consolidamento': { score: 45, intervalDays: 3 },
  'Quasi appreso': { score: 65, intervalDays: 5 },
  'Appreso': { score: 82, intervalDays: 10 },
  'Padroneggiato': { score: 95, intervalDays: 25 }
};

function selfAssessedDirectionProgress(level, now = new Date(), affectsDailySchedule = true) {
  const cfg = SELF_ASSESSMENT_CONFIG[level] || SELF_ASSESSMENT_CONFIG['In apprendimento'];
  const iso = new Date(now).toISOString();
  const nextReviewAt = new Date(new Date(now).getTime() + cfg.intervalDays * 86400000).toISOString();
  return {
    ...defaultDirectionProgress(),
    masteryScore: cfg.score,
    level,
    lastReviewedAt: iso,
    nextReviewAt,
    intervalDays: cfg.intervalDays,
    dailyLastReviewedAt: affectsDailySchedule ? iso : null,
    dailyNextReviewAt: affectsDailySchedule ? nextReviewAt : nextLocalMidnightIso(now),
    dailyIntervalDays: affectsDailySchedule ? cfg.intervalDays : 1,
    selfAssessed: true,
    selfAssessedAt: iso
  };
}

function applySelfAssessment(state, vocabularyId, level, now = new Date(), affectsDailySchedule = true) {
  const iso = new Date(now).toISOString();
  const vp = ensureVocabularyProgress(state, vocabularyId, iso);
  vp.introducedAt = vp.introducedAt || iso;
  vp.introducedDayKey = vp.introducedDayKey || localDateKey(now);
  vp.itToJp = selfAssessedDirectionProgress(level, now, affectsDailySchedule);
  vp.jpToIt = selfAssessedDirectionProgress(level, now, affectsDailySchedule);
  refreshSensePriorityUnlock(state, vocabularyId, now);
  return vp;
}

function intervalFor(progress, result) {
  if (result === 'wrong') return 0.25;
  if (result === 'almost') return 1;
  const level = levelFromProgress(progress);
  const streak = progress.correctStreak || 0;
  switch (level) {
    case 'Nuovo': return 0.5;
    case 'In apprendimento': return 1;
    case 'In consolidamento': return Math.min(4, 2 + Math.floor(streak / 3));
    case 'Quasi appreso': return Math.min(7, 4 + Math.floor(streak / 2));
    case 'Appreso': return Math.min(14, 7 + streak);
    case 'Padroneggiato': return Math.min(35, 20 + Math.floor(streak * 1.5));
    default: return 1;
  }
}

function updateDirectionProgress(progress, { result, exerciseType, now = new Date(), affectsDailySchedule = true }) {
  const next = { ...progress, reviewDays: [...(progress.reviewDays || [])] };
  const beforeLevel = levelFromProgress(next);
  const delta = result === 'correct'
    ? (exerciseType === 'free' ? 12 : 8)
    : result === 'almost' ? 3 : -15;

  next.masteryScore = Math.max(0, Math.min(100, next.masteryScore + delta));
  if (result === 'correct') {
    next.correctCount += 1;
    next.correctStreak += 1;
  } else if (result === 'almost') {
    next.almostCount = (next.almostCount || 0) + 1;
    next.correctStreak = 0;
  } else {
    next.wrongCount += 1;
    next.correctStreak = 0;
  }

  const dayKey = localDateKey(now);
  if (!next.reviewDays.includes(dayKey)) next.reviewDays.push(dayKey);
  next.lastReviewedAt = new Date(now).toISOString();
  next.level = levelFromProgress(next);
  next.intervalDays = intervalFor(next, result);
  next.nextReviewAt = new Date(new Date(now).getTime() + next.intervalDays * 86400000).toISOString();
  if (affectsDailySchedule) {
    next.dailyLastReviewedAt = next.lastReviewedAt;
    next.dailyIntervalDays = next.intervalDays;
    next.dailyNextReviewAt = next.nextReviewAt;
  } else if (!next.dailyNextReviewAt) {
    // Free study changes mastery, counts and recent-error priority, but never consumes a daily review.
    next.dailyLastReviewedAt = next.dailyLastReviewedAt || null;
    next.dailyIntervalDays = Number(next.dailyIntervalDays || 1);
    next.dailyNextReviewAt = nextLocalMidnightIso(now);
  }

  return {
    progress: next,
    beforeLevel,
    afterLevel: next.level,
    levelIncreased: levelRank(next.level) > levelRank(beforeLevel)
  };
}

function isDue(progress, now = new Date()) {
  if (!progress?.lastReviewedAt) return false;
  if (!progress.nextReviewAt) return true;
  return new Date(progress.nextReviewAt).getTime() <= new Date(now).getTime();
}

function isDailyDue(progress, now = new Date()) {
  if (!progress) return false;
  if (!progress.dailyNextReviewAt) return !progress.dailyLastReviewedAt;
  return new Date(progress.dailyNextReviewAt).getTime() <= new Date(now).getTime();
}



/* src/validator.js */
function stripPunctuation(value) {
  return value.replace(/[\s\u3000]+/g, ' ').replace(/[.,;:!?"'“”‘’()[\]{}。、！？・]/g, '').trim();
}

function normalizeItalian(value) {
  return stripPunctuation(String(value ?? '').normalize('NFKC')).toLocaleLowerCase('it-IT');
}

function normalizeJapanese(value) {
  return stripPunctuation(String(value ?? '').normalize('NFKC')).replace(/\s+/g, '');
}

function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) matrix[i][0] = i;
  for (let j = 0; j < cols; j++) matrix[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function fuzzyAlmost(answer, candidates, language) {
  return candidates.some(candidate => {
    const a = language === 'it' ? normalizeItalian(answer) : normalizeJapanese(answer);
    const c = language === 'it' ? normalizeItalian(candidate) : normalizeJapanese(candidate);
    if (!a || !c) return false;
    const distance = levenshtein(a, c);
    const minLen = Math.min(a.length, c.length);
    if (language === 'jp') return minLen >= 4 && distance === 1;
    if (minLen >= 8) return distance <= 2 && distance / Math.max(a.length, c.length) <= 0.2;
    return minLen >= 5 && distance === 1;
  });
}

// Lightweight, deterministic Hepburn-style romanization used only to
// validate free-text IT → JP answers. No runtime network or external library.
const ROMAJI_SINGLE_KANA = Object.freeze({
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','ゐ':'wi','ゑ':'we','を':'o','ん':'n',
  'ゔ':'vu','ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o',
  'ゃ':'ya','ゅ':'yu','ょ':'yo'
});

const ROMAJI_KANA_COMBOS = Object.freeze({
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'しゃ':'sha','しゅ':'shu','しょ':'sho','じゃ':'ja','じゅ':'ju','じょ':'jo',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho','ぢゃ':'ja','ぢゅ':'ju','ぢょ':'jo',
  'にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo',
  'いぇ':'ye','うぃ':'wi','うぇ':'we','うぉ':'wo',
  'ゔぁ':'va','ゔぃ':'vi','ゔぇ':'ve','ゔぉ':'vo','ゔゅ':'vyu',
  'しぇ':'she','じぇ':'je','ちぇ':'che',
  'てぃ':'ti','でぃ':'di','てゅ':'tyu','でゅ':'dyu',
  'とぅ':'tu','どぅ':'du','つぁ':'tsa','つぃ':'tsi','つぇ':'tse','つぉ':'tso',
  'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo','ふゅ':'fyu',
  'くぁ':'kwa','くぃ':'kwi','くぇ':'kwe','くぉ':'kwo',
  'ぐぁ':'gwa','ぐぃ':'gwi','ぐぇ':'gwe','ぐぉ':'gwo'
});

function kanaToHiraganaForRomaji(value) {
  return String(value || '').normalize('NFKC').replace(/[ァ-ヶ]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function kanaToRomaji(value) {
  const kana = kanaToHiraganaForRomaji(value);
  let out = '';
  let geminate = false;
  for (let i = 0; i < kana.length; i++) {
    const ch = kana[i];
    if (ch === 'っ') { geminate = true; continue; }
    if (ch === 'ー') {
      const vowels = out.match(/[aeiou]/g);
      if (vowels?.length) out += vowels[vowels.length - 1];
      continue;
    }
    const pair = kana.slice(i, i + 2);
    let roma = ROMAJI_KANA_COMBOS[pair] || ROMAJI_SINGLE_KANA[ch] || '';
    if (ROMAJI_KANA_COMBOS[pair]) i++;
    if (!roma) continue;
    if (geminate) {
      if (roma.startsWith('ch')) out += 'c';
      else if (roma.startsWith('sh')) out += 's';
      else if (roma.startsWith('ts')) out += 't';
      else if (/^[bcdfghjklmnpqrstvwxyz]/.test(roma)) out += roma[0];
      geminate = false;
    }
    out += roma;
  }
  return out;
}

function normalizeRomaji(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLocaleLowerCase('en-US')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '');
}

function simplifyRomajiLongVowels(value) {
  let current = String(value || '');
  let previous;
  do {
    previous = current;
    current = current
      .replace(/ou/g, 'o')
      .replace(/oo/g, 'o')
      .replace(/uu/g, 'u')
      .replace(/aa/g, 'a')
      .replace(/ii/g, 'i')
      .replace(/ee/g, 'e');
  } while (current !== previous);
  return current;
}

function romajiVariantsFromKana(value) {
  const base = normalizeRomaji(kanaToRomaji(value));
  if (!base) return [];
  const variants = new Set([base, simplifyRomajiLongVowels(base)]);
  variants.add(base.replace(/shi/g, 'si').replace(/chi/g, 'ti').replace(/tsu/g, 'tu').replace(/fu/g, 'hu').replace(/ji/g, 'zi'));
  variants.add(base.replace(/n(?=[bmp])/g, 'm'));
  return [...variants].filter(Boolean);
}

function fuzzyAlmostRomaji(answer, candidates) {
  const a = normalizeRomaji(answer);
  if (!a) return false;
  return candidates.some(candidate => {
    const c = normalizeRomaji(candidate);
    if (!c) return false;
    const distance = levenshtein(a, c);
    const minLen = Math.min(a.length, c.length);
    if (minLen >= 8) return distance <= 2 && distance / Math.max(a.length, c.length) <= 0.2;
    return minLen >= 5 && distance === 1;
  });
}

let italianPromptJapaneseAnswers = new Map();
let italianPromptRomajiAnswers = new Map();
let japaneseSurfaceReadings = new Map();

function rebuildAnswerEquivalenceIndexes(entries) {
  italianPromptJapaneseAnswers = new Map();
  italianPromptRomajiAnswers = new Map();
  japaneseSurfaceReadings = new Map();
  const addMany = (map, key, values) => {
    if (!key) return;
    if (!map.has(key)) map.set(key, new Set());
    const set = map.get(key);
    values.filter(Boolean).forEach(v => set.add(v));
  };
  for (const entry of entries) {
    if (entry.studyEnabled === false || !entry.japanese || !(entry.italian || []).length) continue;
    const japaneseAnswers = [entry.japanese, entry.kana, ...(entry.alternativeJapanese || [])].filter(Boolean);
    const surfaceKey = normalizeJapanese(entry.japanese);
    const reading = displayReading(entry);
    if (surfaceKey && reading) {
      if (!japaneseSurfaceReadings.has(surfaceKey)) japaneseSurfaceReadings.set(surfaceKey, new Set());
      japaneseSurfaceReadings.get(surfaceKey).add(reading);
    }
    // IT→JP may accept exact lexical synonyms only when another studyable entry
    // has the same verified PRIMARY Italian prompt. Secondary glosses must never
    // widen the answer set for a different sense.
    const primaryItalian = (entry.italian || [])[0] || null;
    if (primaryItalian) {
      const italianKey = normalizeItalian(primaryItalian);
      addMany(italianPromptJapaneseAnswers, italianKey, japaneseAnswers);
      if (reading) addMany(italianPromptRomajiAnswers, italianKey, romajiVariantsFromKana(reading));
    }
  }
}

function acceptedAnswers(vocab, direction, italianPrompt = null) {
  if (direction === 'itToJp') {
    const answers = new Set([
      vocab.japanese,
      vocab.kana,
      ...(vocab.alternativeJapanese || [])
    ].filter(Boolean));
    const prompt = italianPrompt || (vocab.italian || [])[0] || null;
    if (prompt) {
      const indexed = italianPromptJapaneseAnswers.get(normalizeItalian(prompt));
      if (indexed) indexed.forEach(v => answers.add(v));
    }
    return [...answers];
  }
  // JP→IT is strictly sense-specific. A translation attached to another sense
  // of the same Japanese surface is not accepted here.
  return [...new Set([
    ...(vocab.italian || []),
    ...(vocab.alternativeItalian || [])
  ].filter(Boolean))];
}

function acceptedRomajiAnswers(vocab, italianPrompt = null) {
  const answers = new Set(romajiVariantsFromKana(displayReading(vocab)));
  const prompt = italianPrompt || (vocab.italian || [])[0] || null;
  if (prompt) {
    const indexed = italianPromptRomajiAnswers.get(normalizeItalian(prompt));
    if (indexed) indexed.forEach(v => answers.add(v));
  }
  return [...answers].filter(Boolean);
}

function validateAnswer(vocab, direction, answer, italianPrompt = null, allowRomaji = false) {
  const candidates = acceptedAnswers(vocab, direction, italianPrompt);
  const normalize = direction === 'itToJp' ? normalizeJapanese : normalizeItalian;
  const normalized = normalize(answer);
  if (!normalized) return { result: 'wrong', candidates };
  if (candidates.some(candidate => normalize(candidate) === normalized)) {
    return { result: 'correct', candidates };
  }
  if (direction === 'itToJp' && allowRomaji) {
    const romanized = normalizeRomaji(answer);
    const romajiCandidates = acceptedRomajiAnswers(vocab, italianPrompt);
    if (romanized && romajiCandidates.some(candidate => normalizeRomaji(candidate) === romanized)) {
      return { result: 'correct', candidates, acceptedAsRomaji: true };
    }
    if (romanized && fuzzyAlmostRomaji(answer, romajiCandidates)) {
      return { result: 'almost', candidates, acceptedAsRomaji: true };
    }
  }
  const language = direction === 'itToJp' ? 'jp' : 'it';
  if (fuzzyAlmost(answer, candidates, language)) return { result: 'almost', candidates };
  return { result: 'wrong', candidates };
}



/* src/session.js */

const QUESTION_DEFAULT_SECONDS = 18;
const CARD_SECONDS = 7;
const PLANNING_BUFFER_SECONDS = 40;

function hashString(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function seededShuffle(items, seedText) {
  const out = [...items];
  const rand = mulberry32(hashString(seedText));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}


// A bounded 6-point seeded tie window preserves variety without allowing
// low-utility vocabulary to systematically outrank much stronger evidence.
function learningPriorityForVocabulary(vocab) {
  const exactScore = Number(KOTOBA_LEARNING_PRIORITY_SCORES[vocab?.id]);
  let score = Number.isFinite(exactScore) ? exactScore : 50;
  if (vocab?._senseForcedPrerequisite && vocab._senseTargetId) {
    const targetScore = Number(KOTOBA_LEARNING_PRIORITY_SCORES[vocab._senseTargetId]);
    if (Number.isFinite(targetScore)) score = Math.max(score, targetScore - 4);
  }
  return Math.max(1, Math.min(99, score));
}

function learningPriorityTieNoise(id, seed) {
  return (hashString(`${seed}:priority:${id}`) % 6001) / 1000 - 3;
}

function prioritizeNewVocabulary(candidates, seed) {
  // Compute the tie-break only once per candidate. Sorting a complete 9,000-
  // word level on mobile must not recompute hashes on every comparison.
  const finalScores = new Map(candidates.map(candidate => [candidate.id,
    learningPriorityForVocabulary(candidate) + learningPriorityTieNoise(candidate.id, seed)
  ]));
  return [...candidates].sort((a, b) =>
    finalScores.get(b.id) - finalScores.get(a.id) || String(a.id).localeCompare(String(b.id))
  );
}

function dateSeed(now) {
  const d = new Date(now);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function averageQuestionSeconds(state) {
  const values = (state.answers || [])
    .slice(-60)
    .map(a => Number(a.timeSpentMs) / 1000)
    .filter(v => Number.isFinite(v) && v >= 2 && v <= 90);
  if (values.length < 8) return QUESTION_DEFAULT_SECONDS;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.max(10, Math.min(35, avg));
}

function introducedToday(state, now) {
  const key = localDateKey(now);
  return Object.values(state.progress || {}).filter(p =>
    p.introducedAt && (p.introducedDayKey || localDateKey(p.introducedAt)) === key
  ).length;
}

function introducedInDailyToday(state, now) {
  const key = localDateKey(now);
  return Object.values(state.progress || {}).filter(p => p?.introducedDailyDayKey === key).length;
}

function sessionDailyDateKey(session) {
  if (session?.dailyDateKey) return session.dailyDateKey;
  // Backward compatibility with sessions saved by older releases.
  if (session?.completedAt) return localDateKey(session.completedAt);
  if (session?.startedAt) return localDateKey(session.startedAt);
  return null;
}

function hasCompletedDailyToday(state, now = new Date()) {
  const key = localDateKey(now);
  return (state.sessions || []).some(session =>
    (!session.mode || session.mode === 'daily') &&
    sessionDailyDateKey(session) === key
  );
}

function sessionStudyDateKey(session) {
  if (session?.dailyDateKey) return session.dailyDateKey;
  if (session?.startedAt) return localDateKey(session.startedAt);
  if (session?.completedAt) return localDateKey(session.completedAt);
  return null;
}

function sessionStudySecondsForDate(session, key) {
  if (session?.studySecondsByDate && Object.prototype.hasOwnProperty.call(session.studySecondsByDate, key)) {
    return Math.max(0, Number(session.studySecondsByDate[key] || 0));
  }
  if (!session?.completedAt || sessionStudyDateKey(session) !== key) return 0;
  return Math.max(0, Number(session.durationSeconds || 0));
}

function completedStudySecondsForDate(state, key) {
  return (state.sessions || []).reduce((sum, session) => sum + sessionStudySecondsForDate(session, key), 0);
}

function studySecondsToday(state, now = new Date()) {
  const key = localDateKey(now);
  const completed = completedStudySecondsForDate(state, key);
  const active = state.activeSession?.studySecondsByDate
    ? Math.max(0, Number(state.activeSession.studySecondsByDate[key] || 0))
    : 0;
  return completed + active;
}

function dailyGoalSeconds(state) {
  return Math.max(1, Number(state.settings.dailyGoalMinutes || state.settings.maxMinutes || 10)) * 60;
}

function dailyGoalProgress(state, now = new Date()) {
  const studiedSeconds = studySecondsToday(state, now);
  const goalSeconds = dailyGoalSeconds(state);
  return {
    studiedSeconds,
    goalSeconds,
    reached: studiedSeconds >= goalSeconds,
    percent: Math.min(100, Math.round(studiedSeconds / goalSeconds * 100))
  };
}

function activeVocabularyIds(state) {
  return Object.entries(state.progress || {})
    .filter(([id, p]) => p && p.introducedAt && !isVocabularyExcluded(state, id) && isActiveStudySense(embeddedVocabularyById.get(id)))
    .map(([id]) => id);
}

function recentWrongCount(state, vocabularyId, direction, now) {
  const cutoff = new Date(now).getTime() - 7 * 86400000;
  return (state.answers || []).slice(-200).filter(a =>
    a.vocabularyId === vocabularyId &&
    a.direction === direction &&
    a.result === 'wrong' &&
    new Date(a.timestamp).getTime() >= cutoff
  ).length;
}

function duePriority(state, vocabularyId, direction, p, now) {
  const dueAt = p.dailyNextReviewAt || p.nextReviewAt;
  const overdueDays = dueAt
    ? Math.max(0, (new Date(now).getTime() - new Date(dueAt).getTime()) / 86400000)
    : 0;
  return (
    overdueDays * 4 +
    (100 - p.masteryScore) * 0.45 +
    (p.wrongCount || 0) * 1.2 +
    recentWrongCount(state, vocabularyId, direction, now) * 8 -
    (p.correctStreak || 0) * 0.5
  );
}

function adaptiveExerciseStageForLevel(level) {
  const rank = levelRank(level);
  if (rank <= levelRank('In apprendimento')) return 'mc';
  if (rank <= levelRank('Quasi appreso')) return 'mixed';
  return 'free';
}

function mixedExerciseTypeFor(index, seed) {
  const pattern = ['mc', 'free'];
  const offset = hashString(seed) % pattern.length;
  return pattern[(index + offset) % pattern.length];
}

function exerciseTypeForLevel(level, index, seed) {
  const stage = adaptiveExerciseStageForLevel(level);
  if (stage === 'mc') return 'mc';
  if (stage === 'free') return 'free';
  return mixedExerciseTypeFor(index, seed);
}

function exerciseTypeForVocabulary(state, vocabularyId, direction, index, seed) {
  const progress = state?.progress?.[vocabularyId]?.[direction] || defaultDirectionProgress();
  return exerciseTypeForLevel(levelFromProgress(progress), index, seed);
}

function distractorScore(candidate, target) {
  let score = 0;
  if (candidate.partOfSpeech === target.partOfSpeech) score += 4;
  score += candidate.topics.filter(t => target.topics.includes(t)).length * 2;
  if (candidate.difficulty === target.difficulty) score += 1;
  return score;
}

function buildOptions(vocabulary, target, direction, seed, italianPrompt = null) {
  const correct = direction === 'itToJp' ? target.japanese : target.italian[0];
  const normalizeLabel = direction === 'itToJp' ? normalizeJapanese : normalizeItalian;
  const validAnswers = new Set(acceptedAnswers(target, direction, italianPrompt).map(normalizeLabel));
  const buckets = new Map();
  for (const candidate of vocabulary) {
    if (candidate.id === target.id || candidate.studyEnabled === false || isVocabularyExcluded(state, candidate.id) || !candidate.japanese || !(candidate.italian || []).length) continue;
    const label = direction === 'itToJp' ? candidate.japanese : candidate.italian[0];
    if (!label || validAnswers.has(normalizeLabel(label))) continue;
    // Extra guard for JP→IT: a different sense record with the identical Japanese
    // surface can never be used as a wrong option when the prompt provides no context.
    if (direction === 'jpToIt' && normalizeJapanese(candidate.japanese) === normalizeJapanese(target.japanese)) continue;
    if (kotobaIsExcludedDistractorPair(candidate.id, target.id)) continue;
    const score = distractorScore(candidate, target);
    if (!buckets.has(score)) buckets.set(score, []);
    buckets.get(score).push(candidate);
  }
  const values = [correct];
  const seen = new Set([normalizeLabel(correct)]);
  const scores = [...buckets.keys()].sort((a, b) => b - a);
  outer: for (const score of scores) {
    const ordered = seededShuffle(buckets.get(score), `${seed}:${target.id}:${direction}:score:${score}`);
    for (const candidate of ordered) {
      const label = direction === 'itToJp' ? candidate.japanese : candidate.italian[0];
      const normalized = normalizeLabel(label);
      if (!seen.has(normalized)) {
        values.push(label);
        seen.add(normalized);
      }
      if (values.length === 4) break outer;
    }
  }
  return seededShuffle(values, `${seed}:options:${target.id}:${direction}`);
}

const QUESTION_REPEAT_GAP = 2;

function containsKanji(value) {
  return /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/u.test(String(value || ''));
}

function katakanaToHiragana(value) {
  return String(value || '').normalize('NFKC').replace(/[ァ-ヶ]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function displayReading(vocab) {
  return vocab?.kana ? katakanaToHiragana(vocab.kana) : '';
}

function exerciseReadingForJapaneseSurface(surface, targetVocab = null) {
  const key = normalizeJapanese(surface);
  if (!key) return '';
  if (targetVocab && normalizeJapanese(targetVocab.japanese) === key) {
    return displayReading(targetVocab);
  }
  const readings = japaneseSurfaceReadings.get(key);
  if (!readings || !readings.size) return '';
  return [...readings].sort((a, b) => a.localeCompare(b, 'ja')).join(' / ');
}

function renderJapaneseExerciseOption(surface, targetVocab = null) {
  const reading = exerciseReadingForJapaneseSurface(surface, targetVocab);
  const showReading = reading && normalizeJapanese(reading) !== normalizeJapanese(surface);
  return `<span class="option-main">${escapeHtml(surface)}</span>${showReading ? `<span class="option-reading">${escapeHtml(reading)}</span>` : ''}`;
}

// A kanji word is introduced only when a verified reading is present in the
// local data. This guarantees that the learning card can always show hiragana
// without guessing a pronunciation.
function canIntroduceVocabulary(vocab) {
  if (!vocab?.japanese || isMergedSense(vocab)) return false;
  return !containsKanji(vocab.japanese) || Boolean(displayReading(vocab));
}

// Greedy deterministic spacing: the same vocabulary must have at least
// QUESTION_REPEAT_GAP other questions between its two directions whenever
// possible. Candidates that cannot be safely placed are deferred rather than
// creating an easy back-to-back reverse prompt.
function spreadCandidatesByVocabulary(candidates, minGap = QUESTION_REPEAT_GAP, initialRecent = []) {
  const pending = [...candidates];
  const ordered = [];
  const recent = initialRecent.slice(-minGap);
  const appearances = new Map();
  while (pending.length) {
    let bestIdx = -1;
    let bestAppearances = Infinity;
    for (let i = 0; i < pending.length; i++) {
      const candidate = pending[i];
      if (recent.includes(candidate.vocabularyId)) continue;
      const seen = appearances.get(candidate.vocabularyId) || 0;
      if (seen < bestAppearances) {
        bestAppearances = seen;
        bestIdx = i;
        if (seen === 0) break;
      }
    }
    if (bestIdx < 0) break;
    const [candidate] = pending.splice(bestIdx, 1);
    ordered.push(candidate);
    appearances.set(candidate.vocabularyId, (appearances.get(candidate.vocabularyId) || 0) + 1);
    recent.push(candidate.vocabularyId);
    while (recent.length > minGap) recent.shift();
  }
  return { ordered, deferred: pending };
}

function safeRetryInsertionIndex(items, currentIndex, vocabularyId, minGap = QUESTION_REPEAT_GAP) {
  let pos = currentIndex + 1;
  let passed = 0;
  while (pos < items.length && passed < 3) {
    if (items[pos].type === 'question') passed++;
    pos++;
  }
  for (let candidatePos = pos; candidatePos <= items.length; candidatePos++) {
    const before = items.slice(0, candidatePos).filter(i => i.type === 'question').slice(-minGap).map(i => i.vocabularyId);
    const after = items.slice(candidatePos).filter(i => i.type === 'question').slice(0, minGap).map(i => i.vocabularyId);
    if (!before.includes(vocabularyId) && !after.includes(vocabularyId)) return candidatePos;
  }
  return -1;
}

function appendNewLearningBatch(items, selectedNew, vocabulary, state, seed, includeOptions = true, source = 'new') {
  let questionIndex = items.filter(i => i.type === 'question').length;
  const secondPass = [];
  selectedNew.forEach((vocab, idx) => {
    items.push({ type: 'learn', vocabularyId: vocab.id, source, learningKind: learningKindForVocabulary(vocab, state, vocabulary), targetVocabularyId: vocab._senseTargetId || vocab.id, targetTopics: candidateTargetTopics(vocab), forcedPrerequisite: Boolean(vocab._senseForcedPrerequisite) });
    const firstDirection = (hashString(`${seed}:${vocab.id}`) + idx) % 2 === 0 ? 'itToJp' : 'jpToIt';
    const secondDirection = firstDirection === 'itToJp' ? 'jpToIt' : 'itToJp';
    const type = exerciseTypeForVocabulary(state, vocab.id, firstDirection, questionIndex++, seed);
    items.push(questionItem(vocab, firstDirection, type, vocabulary, `${seed}:first:${questionIndex}`, source, includeOptions));
    secondPass.push({ vocabularyId: vocab.id, direction: secondDirection, vocab });
  });

  // Add the reverse-direction questions only when enough other questions can
  // sit between them. Otherwise the reverse direction is left unreviewed and
  // collectDue() will schedule it later with high priority.
  const pending = [...secondPass];
  const recent = items.filter(i => i.type === 'question').slice(-QUESTION_REPEAT_GAP).map(i => i.vocabularyId);
  let addedSecond = 0;
  while (pending.length) {
    const idx = pending.findIndex(c => !recent.includes(c.vocabularyId));
    if (idx < 0) break;
    const [candidate] = pending.splice(idx, 1);
    const type = exerciseTypeForVocabulary(state, candidate.vocab.id, candidate.direction, questionIndex++, seed);
    items.push(questionItem(candidate.vocab, candidate.direction, type, vocabulary, `${seed}:second:${questionIndex}`, source, includeOptions));
    recent.push(candidate.vocabularyId);
    while (recent.length > QUESTION_REPEAT_GAP) recent.shift();
    addedSecond++;
  }
  return { addedSecond, deferredSecond: pending.length };
}

function collectDue(vocabulary, state, now, seed) {
  const byId = new Map(vocabulary.filter(isActiveStudySense).map(v => [v.id, v]));
  const due = [];
  for (const [id, progress] of Object.entries(state.progress || {})) {
    if (!progress.introducedAt || !byId.has(id) || isVocabularyExcluded(state, id)) continue;
    for (const direction of ['itToJp', 'jpToIt']) {
      const p = progress[direction] || defaultDirectionProgress();
      const dailyScheduleKnown = Boolean(p.dailyNextReviewAt || p.dailyLastReviewedAt);
      const dailyDue = dailyScheduleKnown ? isDailyDue(p, now) : (!p.lastReviewedAt || isDue(p, now));
      if (dailyDue) {
        due.push({
          vocabularyId: id,
          direction,
          priority: !p.dailyLastReviewedAt && !p.lastReviewedAt ? 10000 : duePriority(state, id, direction, p, now)
        });
      }
    }
  }
  return seededShuffle(due, `${seed}:due-ties`).sort((a, b) => b.priority - a.priority);
}

function entryGroupKey(vocab) {
  return String(vocab?.jmdictEntryId || vocab?.id || '');
}

function entryHasIntroducedSense(vocabulary, state, vocab) {
  const key = entryGroupKey(vocab);
  return vocabulary.some(candidate =>
    entryGroupKey(candidate) === key && Boolean(state.progress?.[candidate.id]?.introducedAt)
  );
}

function learningKindForVocabulary(vocab, state, vocabulary) {
  return entryHasIntroducedSense(vocabulary, state, vocab) ? 'sense' : 'word';
}

function availableNewWords(vocabulary, state, selectedTopics) {
  if (!selectedTopics.length) return [];
  const vocabMap = new Map(vocabulary.map(v => [v.id, v]));
  const byEntry = new Map();

  // Topics identify the desired sense. A merged sense may still act as a topic
  // trigger, but its pedagogical target is the surviving merged-into sense.
  for (const trigger of vocabulary) {
    if (trigger.studyEnabled === false || trigger.aliasOf || !trigger.japanese || !(trigger.italian || []).length) continue;
    const matchedTopics = (trigger.topics || []).filter(t => selectedTopics.includes(t));
    if (!matchedTopics.length || isVocabularyExcluded(state, trigger.id)) continue;
    const target = trigger.mergedIntoSenseId ? vocabMap.get(trigger.mergedIntoSenseId) : trigger;
    if (!target || !isActiveStudySense(target) || !canIntroduceVocabulary(target) || isVocabularyExcluded(state, target.id)) continue;
    if (state.progress?.[target.id]?.introducedAt) continue;
    const key = entryGroupKey(target);
    if (!byEntry.has(key)) byEntry.set(key, new Map());
    const targetMap = byEntry.get(key);
    const existing = targetMap.get(target.id);
    const triggerStudyLevel = vocabularyStudyLevel(trigger) || vocabularyStudyLevel(target);
    if (!triggerStudyLevel) continue;
    const triggerRank = studyLevelRank(triggerStudyLevel);
    if (!existing || triggerRank < existing.triggerRank) {
      targetMap.set(target.id, { target, trigger, triggerRank, matchedTopics });
    } else {
      existing.matchedTopics = [...new Set([...existing.matchedTopics, ...matchedTopics])];
    }
  }

  const eligible = [];
  for (const targetMap of byEntry.values()) {
    const targets = [...targetMap.values()].sort((a, b) =>
      sensePriorityRank(a.target) - sensePriorityRank(b.target) || a.triggerRank - b.triggerRank
    );
    let chosen = null;
    for (const descriptor of targets) {
      const { target, trigger, matchedTopics } = descriptor;
      let required = null;
      let blocked = false;
      let waitingForConsolidation = false;
      for (const prerequisiteId of (target.prerequisiteSenseIds || [])) {
        const prerequisite = vocabMap.get(prerequisiteId);
        if (!prerequisite || !isActiveStudySense(prerequisite) || !canIntroduceVocabulary(prerequisite) || isVocabularyExcluded(state, prerequisiteId)) {
          blocked = true;
          break;
        }
        if (!state.progress?.[prerequisiteId]?.introducedAt) {
          required = prerequisite;
          break;
        }
        if (!isSensePriorityUnlocked(state, prerequisiteId)) {
          waitingForConsolidation = true;
          break;
        }
      }
      if (blocked || waitingForConsolidation) continue;
      required = required || target;
      if (state.progress?.[required.id]?.introducedAt || isVocabularyExcluded(state, required.id) || !canIntroduceVocabulary(required)) continue;
      chosen = {
        ...required,
        _senseTargetId: target.id,
        _senseTargetStudyLevel: vocabularyStudyLevel(trigger) || vocabularyStudyLevel(target),
        _senseTargetTopics: matchedTopics,
        _senseForcedPrerequisite: required.id !== target.id
      };
      break;
    }
    if (chosen) eligible.push(chosen);
  }
  return eligible;
}

function topicLearningTargets(vocabulary, state, selectedTopics) {
  const vocabMap = new Map(vocabulary.map(v => [v.id, v]));
  const targets = new Map();
  for (const trigger of vocabulary) {
    if (trigger.studyEnabled === false || trigger.aliasOf || !(trigger.topics || []).some(t => selectedTopics.includes(t))) continue;
    if (isVocabularyExcluded(state, trigger.id)) continue;
    const target = trigger.mergedIntoSenseId ? vocabMap.get(trigger.mergedIntoSenseId) : trigger;
    if (!target || !isActiveStudySense(target) || !canIntroduceVocabulary(target) || isVocabularyExcluded(state, target.id)) continue;
    const triggerStudyLevel = vocabularyStudyLevel(trigger) || vocabularyStudyLevel(target);
    if (!triggerStudyLevel) continue;
    const rank = studyLevelRank(triggerStudyLevel);
    const existing = targets.get(target.id);
    if (!existing || rank < existing.targetStudyLevelRank) targets.set(target.id, { vocab: target, targetStudyLevelRank: rank });
  }
  return [...targets.values()];
}

function studyLevelLearningSnapshot(vocabulary, state, selectedTopics) {
  const target = normalizedStudyLevel(state.settings.studyLevel || legacyJlptToStudyLevel(state.settings.jlptLevel));
  const targetRank = studyLevelRank(target);
  const relevant = topicLearningTargets(vocabulary, state, selectedTopics).filter(x => x.targetStudyLevelRank <= targetRank);
  let encountered = 0, consolidated = 0;
  for (const item of relevant) {
    const vp = state.progress?.[item.vocab.id];
    if (!vp?.introducedAt) continue;
    encountered++;
    if (isSensePriorityUnlocked(state, item.vocab.id)) consolidated++;
  }
  const total = relevant.length;
  const coverage = total ? encountered / total : 1;
  const consolidation = encountered ? consolidated / encountered : 0;
  const minEncountered = Math.min(total, Math.max(30, Number(state.settings.newPerDay || 10) * 3));
  const nextRank = Math.min(STUDY_LEVELS.length - 1, targetRank + 1);
  const unlockedNext = targetRank < STUDY_LEVELS.length - 1 && (
    total === 0 ||
    (encountered >= minEncountered && coverage >= 0.35 && consolidation >= 0.65) ||
    (coverage >= 0.75 && consolidation >= 0.55)
  );
  return { target, targetRank, nextRank, unlockedNext, total, encountered, consolidated, coverage, consolidation };
}

function candidateTargetStudyLevelRank(vocab) {
  const level = vocab?._senseTargetStudyLevel || vocabularyStudyLevel(vocab);
  return level ? studyLevelRank(level) : Number.POSITIVE_INFINITY;
}

function candidateTargetTopics(vocab) {
  return Array.isArray(vocab?._senseTargetTopics) && vocab._senseTargetTopics.length ? vocab._senseTargetTopics : (vocab?.topics || []);
}

function eligibleNewWordsByStudyLevel(vocabulary, state, selectedTopics) {
  const all = availableNewWords(vocabulary, state, selectedTopics);
  const snapshot = studyLevelLearningSnapshot(vocabulary, state, selectedTopics);
  let maxRank = snapshot.unlockedNext ? snapshot.nextRank : snapshot.targetRank;
  let words = all.filter(v => candidateTargetStudyLevelRank(v) <= maxRank);

  // Do not jump to harder Study Level material merely because the next in-band sense
  // is temporarily waiting for prerequisite consolidation.
  const targetInventory = topicLearningTargets(vocabulary, state, selectedTopics);
  const hasPendingTargetAtOrBelow = targetInventory.some(({ vocab, targetStudyLevelRank }) =>
    targetStudyLevelRank <= maxRank && !state.progress?.[vocab.id]?.introducedAt && !isVocabularyExcluded(state, vocab.id)
  );
  if (!words.length && !hasPendingTargetAtOrBelow) {
    for (let rank = snapshot.targetRank + 1; rank < STUDY_LEVELS.length; rank++) {
      const band = all.filter(v => candidateTargetStudyLevelRank(v) === rank);
      if (band.length) { words = band; maxRank = rank; break; }
    }
  }
  return { words, snapshot: { ...snapshot, effectiveMaxRank: maxRank } };
}

function selectNewWords(vocabulary, state, selectedTopics, count, seed) {
  if (!selectedTopics.length || count <= 0) return [];
  const { words: unseen, snapshot } = eligibleNewWordsByStudyLevel(vocabulary, state, selectedTopics);
  if (!unseen.length) return [];

  // Build a topic-balanced queue for each Study Level band. The schedule
  // interleaves the learner's target level with easier material instead of
  // exhausting one band first. The next band enters gradually after consolidation.
  const bandQueues = new Map();
  const used = new Set();
  const makeBandQueue = rank => {
    const band = unseen.filter(v => candidateTargetStudyLevelRank(v) === rank);
    if (!band.length) return [];
    const pools = new Map();
    const offsets = new Map();
    selectedTopics.forEach(topic => {
      pools.set(topic, prioritizeNewVocabulary(
        band.filter(v => candidateTargetTopics(v).includes(topic)),
        `${seed}:study-level:${rank}:topic:${topic}`));
      offsets.set(topic, 0);
    });
    // Shuffle topic rotation, NOT the vocabulary priorities inside a topic.
    const topicOrder = seededShuffle(selectedTopics, `${seed}:study-level:${rank}:topic-order`);
    const out = [], local = new Set();
    let cursor = 0, consecutiveEmptyTopics = 0;
    // Each pool is already ranked. Cursors avoid a quadratic scan of long lists
    // when the learner selects many topics or the catch-all topic.
    while (out.length < band.length && consecutiveEmptyTopics < topicOrder.length) {
      const topic = topicOrder[cursor++ % topicOrder.length];
      const pool = pools.get(topic) || [];
      let offset = offsets.get(topic) || 0;
      while (offset < pool.length && local.has(pool[offset].id)) offset++;
      offsets.set(topic, offset + 1);
      if (offset < pool.length) {
        const candidate = pool[offset];
        out.push(candidate); local.add(candidate.id);
        consecutiveEmptyTopics = 0;
      } else {
        consecutiveEmptyTopics++;
      }
    }
    // Include any unassigned candidate without breaking the priority order.
    if (local.size < band.length) {
      for (const candidate of prioritizeNewVocabulary(band, `${seed}:study-level:${rank}:remainder`)) {
        if (!local.has(candidate.id)) { out.push(candidate); local.add(candidate.id); }
      }
    }
    return out;
  };
  for (let rank = 0; rank <= (snapshot.effectiveMaxRank ?? snapshot.targetRank); rank++) {
    bandQueues.set(rank, makeBandQueue(rank));
  }

  const target = snapshot.targetRank;
  const easier = [];
  for (let r = target - 1; r >= 0; r--) easier.push(r);
  // Target remains the main focus, while easier words continuously fill gaps.
  // Once the next band is unlocked it receives a small exploratory share.
  let cycle = [target, target, ...easier];
  if (snapshot.unlockedNext && snapshot.nextRank <= (snapshot.effectiveMaxRank ?? target)) {
    cycle = [target, target, ...easier, target, ...easier, snapshot.nextRank];
  }
  if (!cycle.length) cycle = [target];

  const picked = [];
  let cursor = 0, safety = 0;
  const maxRank = snapshot.effectiveMaxRank ?? snapshot.targetRank;
  const remainingInRank = rank => (bandQueues.get(rank) || []).some(v => !used.has(v.id));
  const takeFromRank = rank => {
    const q = bandQueues.get(rank) || [];
    const v = q.find(candidate => !used.has(candidate.id));
    if (!v) return false;
    picked.push(v); used.add(v.id); return true;
  };

  while (picked.length < count && safety++ < count * 30 + 200) {
    if (![...bandQueues.keys()].some(remainingInRank)) break;
    const desired = cycle[cursor++ % cycle.length];
    if (desired <= maxRank && takeFromRank(desired)) continue;
    // If a scheduled band is exhausted, choose the nearest still-eligible band.
    const fallback = [...bandQueues.keys()]
      .filter(r => r <= maxRank && remainingInRank(r))
      .sort((a,b) => Math.abs(a-target)-Math.abs(b-target) || a-b)[0];
    if (fallback !== undefined) takeFromRank(fallback);
  }
  return picked;
}

function questionItem(vocab, direction, exerciseType, vocabulary, seed, source = 'review', includeOptions = true) {
  const italianChoices = (vocab.italian || []).filter(Boolean);
  const italianPrompt = direction === 'itToJp' && italianChoices.length
    ? italianChoices[hashString(`${seed}:italian-prompt:${vocab.id}`) % italianChoices.length]
    : null;
  return {
    type: 'question',
    vocabularyId: vocab.id,
    direction,
    exerciseType,
    source,
    italianPrompt,
    options: exerciseType === 'mc' && includeOptions ? buildOptions(vocabulary, vocab, direction, seed, italianPrompt) : null,
    retryCount: 0
  };
}

function collectActivePractice(vocabulary, state, now, seed) {
  const vocabMap = new Map(vocabulary.filter(isActiveStudySense).map(v => [v.id, v]));
  const candidates = [];
  for (const [id, vp] of Object.entries(state.progress || {})) {
    if (!vp?.introducedAt || !vocabMap.has(id) || isVocabularyExcluded(state, id)) continue;
    for (const direction of ['itToJp', 'jpToIt']) {
      const dp = vp[direction] || defaultDirectionProgress();
      const recentErrors = recentWrongCount(state, id, direction, now);
      const ageHours = dp.lastReviewedAt ? Math.max(0, (new Date(now) - new Date(dp.lastReviewedAt)) / 3600000) : 999;
      const priority = (100 - (dp.masteryScore || 0)) * 0.55 + recentErrors * 12 + Math.min(48, ageHours) * 0.35;
      candidates.push({ vocabularyId: id, direction, priority });
    }
  }
  return seededShuffle(candidates, `${seed}:active-ties`).sort((a, b) => b.priority - a.priority);
}

function appendActivePractice(items, vocabulary, state, now, seed, maxQuestions, source = 'consolidation', includeOptions = true) {
  if (maxQuestions <= 0) return 0;
  const vocabMap = new Map(vocabulary.filter(isActiveStudySense).map(v => [v.id, v]));
  const ordered = collectActivePractice(vocabulary, state, now, seed);
  const existing = new Set(items.filter(i => i.type === 'question').map(i => `${i.vocabularyId}:${i.direction}`));
  const baseRecent = items.filter(i => i.type === 'question').slice(-QUESTION_REPEAT_GAP).map(i => i.vocabularyId);
  const candidates = ordered.filter(c => !existing.has(`${c.vocabularyId}:${c.direction}`));
  const spaced = spreadCandidatesByVocabulary(candidates, QUESTION_REPEAT_GAP, baseRecent);
  let added = 0;
  let questionIndex = items.filter(i => i.type === 'question').length;
  for (const candidate of spaced.ordered) {
    if (added >= maxQuestions) break;
    const vocab = vocabMap.get(candidate.vocabularyId);
    if (!vocab) continue;
    const type = exerciseTypeForVocabulary(state, vocab.id, candidate.direction, questionIndex++, seed);
    items.push(questionItem(vocab, candidate.direction, type, vocabulary, `${seed}:active:${questionIndex}`, source, includeOptions));
    existing.add(`${candidate.vocabularyId}:${candidate.direction}`);
    added++;
  }
  return added;
}

// 3.1.8: the daily session is governed by time and a five-position mix.
// New-word limits are OPTIONAL; legacy caps are migrated into advanced settings.
const DAILY_BALANCE_LABELS = ['Solo ripasso', 'Più ripasso', 'Equilibrato', 'Più nuove', 'Solo nuove'];
const DAILY_BALANCE_SHARES = [0, 0.25, 0.40, 0.65, 1];
function dailyBalanceIndex(settings) {
  const v = Number(settings?.dailyBalance);
  return Number.isInteger(v) && v >= 0 && v <= 4 ? v : 2;
}
function dailyNewLimitRemaining(state, now = new Date()) {
  const limit = state.settings.dailyNewLimit;
  if (limit == null || limit === '') return Infinity;
  return Math.max(0, Math.floor(Number(limit) || 0) - introducedInDailyToday(state, now));
}
function buildDailySession(vocabulary, state, now = new Date(), previewOnly = false) {
  const seed = dateSeed(now);
  const avgSeconds = averageQuestionSeconds(state);
  const targetSeconds = Math.max(180, dailyGoalSeconds(state));
  const planningBudget = Math.max(60, targetSeconds - PLANNING_BUFFER_SECONDS);
  const selectedTopics = state.settings.selectedTopics || [];
  const due = collectDue(vocabulary, state, now, seed);
  const hasActive = activeVocabularyIds(state).length > 0;
  const availableNewCount = eligibleNewWordsByStudyLevel(vocabulary, state, selectedTopics).words.length;
  const optionalRemaining = dailyNewLimitRemaining(state, now);
  const requestedNew = Math.min(availableNewCount, optionalRemaining);
  const balance = dailyBalanceIndex(state.settings);
  const share = DAILY_BALANCE_SHARES[balance];
  const canAddNew = share > 0 && requestedNew > 0;
  const canReview = share < 1 && hasActive;
  const costPerNew = CARD_SECONDS + 2 * avgSeconds;
  // If a component is unavailable, the other may use the whole time budget.
  const effectiveNewShare = !canAddNew ? 0 : !canReview ? 1 : share;
  const reservedReview = canReview && canAddNew ? avgSeconds : 0;
  const newBudget = Math.max(0, (planningBudget - reservedReview) * effectiveNewShare);
  let plannedNewCount = canAddNew
    ? Math.min(requestedNew, Math.floor(newBudget / costPerNew))
    : 0;
  if (canAddNew && plannedNewCount === 0 && planningBudget >= costPerNew + reservedReview) {
    plannedNewCount = 1;
  }
  const reservedNewSeconds = plannedNewCount * costPerNew;
  const reviewBudget = canReview ? Math.max(0, planningBudget - reservedNewSeconds) : 0;
  const spacedDue = canReview ? spreadCandidatesByVocabulary(due) : {ordered: []};
  const items = [];
  let reviewSpent = 0;
  let reviewCount = 0;
  let consolidationCount = 0;
  let questionIndex = 0;
  const byVocabularyId = new Map(vocabulary.filter(isActiveStudySense).map(v => [v.id, v]));
  for (const candidate of spacedDue.ordered) {
    if (reviewSpent + avgSeconds > reviewBudget) break;
    const vocab = byVocabularyId.get(candidate.vocabularyId);
    if (!vocab) continue;
    const type = exerciseTypeForVocabulary(state, vocab.id, candidate.direction, questionIndex++, seed);
    items.push(questionItem(vocab, candidate.direction, type, vocabulary, `${seed}:due:${questionIndex}`, 'review', !previewOnly));
    reviewSpent += avgSeconds;
    reviewCount++;
  }
  if (canReview) {
    const capacity = Math.max(0, Math.floor((reviewBudget - reviewSpent) / avgSeconds));
    if (capacity > 0) {
      consolidationCount = appendActivePractice(items, vocabulary, state, now, `${seed}:daily-balance`, capacity, 'consolidation', !previewOnly);
      reviewCount += consolidationCount;
      reviewSpent += consolidationCount * avgSeconds;
    }
    if (reviewCount === 0 && canAddNew) {
      consolidationCount += appendActivePractice(items, vocabulary, state, now, `${seed}:daily-min-review`, 1, 'consolidation', !previewOnly);
      reviewCount += consolidationCount;
      reviewSpent += consolidationCount * avgSeconds;
    }
  }
  const selectedNew = selectNewWords(vocabulary, state, selectedTopics, plannedNewCount, seed);
  appendNewLearningBatch(items, selectedNew, vocabulary, state, `${seed}:new`, !previewOnly, 'new');
  const totalEstimated = reviewSpent + selectedNew.length * costPerNew;
  let capMessage = null;
  if (share > 0 && !availableNewCount && selectedTopics.length) {
    capMessage = 'Non ci sono nuove parole negli argomenti selezionati. La sessione si concentrerà sui ripassi disponibili.';
  } else if (share === 0 && !hasActive) {
    capMessage = 'Non hai ancora parole attive da ripassare. Scegli un bilanciamento che includa nuove parole per iniziare.';
  } else if (share > 0 && share < 1 && !hasActive && availableNewCount > 0) {
    capMessage = 'Non ci sono ancora parole da ripassare: inizieremo con nuove parole.';
  } else if (optionalRemaining === 0 && share > 0 && availableNewCount) {
    capMessage = 'Hai raggiunto il limite facoltativo delle nuove parole. Modificalo nelle impostazioni avanzate per studiarne altre.';
  } else if (requestedNew > selectedNew.length && share > 0 && requestedNew !== Infinity) {
    capMessage = `In base al tempo e al bilanciamento scelti, oggi introdurremo ${selectedNew.length} nuove parole. Le altre restano disponibili nello studio libero.`;
  }
  return {
    seed, items, reviewCount, consolidationCount,
    deferredReviewCount: Math.max(0, due.length - Math.max(0, reviewCount - consolidationCount)),
    newCount: selectedNew.length, requestedNew, availableNewCount,
    estimatedSeconds: Math.round(totalEstimated), avgQuestionSeconds: avgSeconds,
    targetSeconds, capMessage, mode: 'daily', dailyBalance: balance
  };
}

// Free study has a STRICT maximum question count (learning cards do not count).
// A new word is practised in both directions if spacing can be respected.
function buildFreeSession(vocabulary, state, now = new Date(), previewOnly = false) {
  const maxExercises = Math.max(10, Math.min(60, Math.round((Number(state.settings.freeExercises) || 20) / 5) * 5));
  const newRequested = Math.max(0, Math.min(Math.floor(maxExercises / 2), Math.floor(Number(state.settings.freeNew) || 0)));
  const seed = `${dateSeed(now)}:free:${(state.sessions || []).length}:${(state.answers || []).length}`;
  const avgSeconds = averageQuestionSeconds(state);
  const newWords = selectNewWords(vocabulary, state, state.settings.selectedTopics || [], newRequested, seed);
  const reviewQuota = Math.max(0, maxExercises - 2 * newWords.length);
  const reviewCandidates = spreadCandidatesByVocabulary(collectActivePractice(vocabulary, state, now, seed)).ordered;
  const activeById = new Map(vocabulary.filter(isActiveStudySense).map(v => [v.id, v]));
  const scheduledReviews = reviewCandidates.slice(0, reviewQuota).map((candidate, idx) => {
    const vocab = activeById.get(candidate.vocabularyId);
    return vocab ? {
      vocabularyId: vocab.id,
      question: questionItem(vocab, candidate.direction,
        exerciseTypeForVocabulary(state, vocab.id, candidate.direction, idx, seed),
        vocabulary, `${seed}:review:${idx}`, 'free-review', !previewOnly)
    } : null;
  }).filter(Boolean);
  const firstNew = [], secondNew = [];
  newWords.forEach((vocab, idx) => {
    const firstDirection = (hashString(`${seed}:${vocab.id}`) + idx) % 2 === 0 ? 'itToJp' : 'jpToIt';
    const secondDirection = firstDirection === 'itToJp' ? 'jpToIt' : 'itToJp';
    const learnBefore = {
      type: 'learn', vocabularyId: vocab.id, source: 'new',
      learningKind: learningKindForVocabulary(vocab, state, vocabulary),
      targetVocabularyId: vocab._senseTargetId || vocab.id,
      targetTopics: candidateTargetTopics(vocab),
      forcedPrerequisite: Boolean(vocab._senseForcedPrerequisite)
    };
    firstNew.push({vocabularyId: vocab.id, learnBefore,
      question: questionItem(vocab, firstDirection,
        exerciseTypeForVocabulary(state, vocab.id, firstDirection, idx, seed),
        vocabulary, `${seed}:first:${idx}`, 'new', !previewOnly)});
    secondNew.push({vocabularyId: vocab.id,
      question: questionItem(vocab, secondDirection,
        exerciseTypeForVocabulary(state, vocab.id, secondDirection, idx + newWords.length, seed),
        vocabulary, `${seed}:second:${idx}`, 'new', !previewOnly)});
  });
  // Spread review questions across the first learning pass to keep the mixture
  // useful while keeping each learning card adjacent to its first exercise.
  const planned = [];
  if (firstNew.length) {
    for (let i = 0; i < firstNew.length; i++) {
      planned.push(firstNew[i]);
      const from = Math.floor(i * scheduledReviews.length / firstNew.length);
      const to = Math.floor((i + 1) * scheduledReviews.length / firstNew.length);
      planned.push(...scheduledReviews.slice(from, to));
    }
  } else planned.push(...scheduledReviews);
  planned.push(...secondNew);
  const spaced = spreadCandidatesByVocabulary(planned).ordered;
  const questions = spaced.slice(0, maxExercises);
  const items = [];
  for (const candidate of questions) {
    if (candidate.learnBefore) items.push(candidate.learnBefore);
    items.push(candidate.question);
  }
  const actualNew = items.filter(i => i.type === 'learn').length;
  const actualReview = items.filter(i => i.type === 'question' && i.source === 'free-review').length;
  const actualQuestions = items.filter(i => i.type === 'question').length;
  return {
    seed, items, reviewCount: actualReview, deferredReviewCount: 0,
    newCount: actualNew, requestedNew: newRequested, estimatedSeconds: Math.round(actualQuestions * avgSeconds + actualNew * CARD_SECONDS),
    avgQuestionSeconds: avgSeconds, targetSeconds: Math.round(actualQuestions * avgSeconds + actualNew * CARD_SECONDS),
    plannedExercises: maxExercises, plannedNewWords: newRequested,
    capMessage: actualQuestions < maxExercises
      ? `Con le parole attualmente disponibili e le distanze fra le domande, puoi svolgere ${actualQuestions} esercizi sui ${maxExercises} richiesti. Puoi aggiungere altre nuove parole o studiare altri argomenti.`
      : null,
    mode: 'free'
  };
}


function buildExtraNewSession(vocabulary, state, now = new Date()) {
  const seed = `${dateSeed(now)}:extra-new:${(state.sessions || []).length}:${introducedToday(state, now)}`;
  const avgSeconds = averageQuestionSeconds(state);
  const targetSeconds = 10 * 60;
  const planningBudget = Math.max(60, targetSeconds - PLANNING_BUFFER_SECONDS);
  const costPerNew = CARD_SECONDS + avgSeconds * 2;
  const capacityForNew = Math.max(0, Math.floor(planningBudget / costPerNew));
  const requested = Math.max(1, Number(state.settings.newPerDay || 10));
  const newCount = Math.min(requested, capacityForNew);
  const selectedNew = selectNewWords(vocabulary, state, state.settings.selectedTopics || [], newCount, seed);
  const items = [];
  appendNewLearningBatch(items, selectedNew, vocabulary, state, seed, true, 'extra-new');
  return {
    seed, items, reviewCount: 0, deferredReviewCount: 0, newCount: selectedNew.length,
    requestedNew: requested, estimatedSeconds: Math.round(selectedNew.length * costPerNew),
    avgQuestionSeconds: avgSeconds, targetSeconds, capMessage: null, mode: 'extra-new'
  };
}

function buildExtraActiveSession(vocabulary, state, now = new Date()) {
  const seed = `${dateSeed(now)}:extra-active:${(state.sessions || []).length}:${(state.answers || []).length}`;
  const avgSeconds = averageQuestionSeconds(state);
  const targetSeconds = 10 * 60;
  const planningBudget = Math.max(60, targetSeconds - PLANNING_BUFFER_SECONDS);
  const capacity = Math.max(1, Math.floor(planningBudget / avgSeconds));
  const vocabMap = new Map(vocabulary.filter(isActiveStudySense).map(v => [v.id, v]));
  const candidates = collectActivePractice(vocabulary, state, now, seed);
  const spaced = spreadCandidatesByVocabulary(candidates);
  const items = [];
  let questionIndex = 0;
  for (const candidate of spaced.ordered) {
    if (items.length >= capacity) break;
    const vocab = vocabMap.get(candidate.vocabularyId);
    if (!vocab) continue;
    const type = exerciseTypeForVocabulary(state, vocab.id, candidate.direction, questionIndex++, seed);
    items.push(questionItem(vocab, candidate.direction, type, vocabulary, `${seed}:${questionIndex}`, 'extra-active'));
  }
  return {
    seed, items, reviewCount: items.length, deferredReviewCount: Math.max(0, candidates.length - items.length),
    newCount: 0, requestedNew: 0, estimatedSeconds: Math.round(items.length * avgSeconds),
    avgQuestionSeconds: avgSeconds, targetSeconds, capMessage: null, mode: 'extra-active'
  };
}


/* src/stats.js */

const bothDirections = p => [p.itToJp, p.jpToIt];

function computeStats(vocabulary, state, now = new Date()) {
  const progressEntries = Object.entries(state.progress || {}).filter(([id]) => !isVocabularyExcluded(state, id) && !isMergedSense(embeddedVocabularyById.get(id)));
  const encounteredIds = new Set(progressEntries.filter(([, p]) => p.introducedAt).map(([id]) => id));
  const learned = progressEntries.filter(([, p]) => bothDirections(p).every(d => levelRank(levelFromProgress(d)) >= levelRank('Appreso'))).length;
  const mastered = progressEntries.filter(([, p]) => bothDirections(p).every(d => levelFromProgress(d) === 'Padroneggiato')).length;

  const cutoff = new Date(now).getTime() - 7 * 86400000;
  const recent = (state.answers || []).filter(a => new Date(a.timestamp).getTime() >= cutoff);
  const accuracy7 = recent.length ? Math.round(recent.filter(a => a.result === 'correct').length / recent.length * 100) : 0;

  const byLevel = Object.fromEntries(LEVELS.map(l => [l, 0]));
  progressEntries.forEach(([, p]) => {
    const weakest = bothDirections(p).map(levelFromProgress).sort((a, b) => levelRank(a) - levelRank(b))[0];
    byLevel[weakest] += 1;
  });

  const directionStats = {};
  for (const key of ['itToJp', 'jpToIt']) {
    const values = progressEntries.map(([, p]) => p[key]).filter(Boolean);
    directionStats[key] = {
      averageMastery: values.length ? Math.round(values.reduce((sum, p) => sum + p.masteryScore, 0) / values.length) : 0,
      learned: values.filter(p => levelRank(levelFromProgress(p)) >= levelRank('Appreso')).length,
      mastered: values.filter(p => levelFromProgress(p) === 'Padroneggiato').length
    };
  }

  const byTopic = {};
  const topicEffectiveIds = new Map();
  for (const vocab of vocabulary) {
    if (vocab.studyEnabled === false || vocab.aliasOf || isVocabularyExcluded(state, vocab.id)) continue;
    const effective = effectiveLearningSense(vocab);
    if (!effective || !isActiveStudySense(effective) || isVocabularyExcluded(state, effective.id)) continue;
    for (const topic of (vocab.topics || [])) {
      if (!topicEffectiveIds.has(topic)) topicEffectiveIds.set(topic, new Set());
      const seen = topicEffectiveIds.get(topic);
      if (seen.has(effective.id)) continue;
      seen.add(effective.id);
      if (!byTopic[topic]) byTopic[topic] = { encountered: 0, total: 0, masterySum: 0, unseen: 0 };
      byTopic[topic].total += 1;
      const p = state.progress[effective.id];
      if (p?.introducedAt) {
        byTopic[topic].encountered += 1;
        byTopic[topic].masterySum += (p.itToJp.masteryScore + p.jpToIt.masteryScore) / 2;
      }
    }
  }
  Object.values(byTopic).forEach(t => {
    // Topic progress now represents progress across the whole topic, including
    // unseen vocabulary as 0 mastery. This makes 10% actually mean roughly
    // one tenth of the topic has been learned, rather than 10% mastery among
    // only the words already encountered.
    t.unseen = Math.max(0, t.total - t.encountered);
    t.progress = t.total ? Math.round(t.masterySum / t.total) : 0;
  });

  return {
    encountered: encounteredIds.size,
    learned,
    mastered,
    accuracy7,
    streak: computeStreak(state.sessions || [], now),
    byLevel,
    byTopic,
    directionStats
  };
}

function computeStreak(sessions, now = new Date()) {
  const days = new Set(sessions.filter(s => s.completedAt).map(s => localDateKey(s.completedAt)));
  let cursor = new Date(now);
  const todayKey = localDateKey(cursor);
  if (!days.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}



/* src/app.js */






const root = document.querySelector('#app');
let vocabulary = [];
let state = migrateEquivalentVocabularyState(loadState());
saveState(state);
let view = 'home';
let onboardingStep = 1;
let runtime = null;
let feedback = null;
let answerStartedAt = Date.now();
let selectedOption = null;
let learnDecisionMode = null;
let excludedManagerOpen = false;
let settingsOpenSection = null;
let advancedDailyOpen = false;
let freeFinishDialogOpen = false;
let excludedSelection = new Set();
let excludedSearch = '';
let resetDialogOpen = false;
let kanaState = null;
let kanaRuntime = null;
let kanaFeedbackTimer = null;
let observedDayKey = localDateKey();
let midnightTimer = null;
const SESSION_CHECKPOINT_MS = 5000;
const MAX_UNCHECKPOINTED_MS = 15000;
let sessionCheckpointTimer = null;

const byId = id => vocabulary.find(v => v.id === id);
const clampInt = (value, fallback = 0) => Math.max(0, Math.floor(Number.isFinite(Number(value)) ? Number(value) : fallback));
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
function usageRegisterBadgeHtml(vocab) {
  const reg = vocab?.usageRegister;
  if (!reg?.labelItalian) return '';
  return `<span class="register-badge">${escapeHtml(reg.labelItalian)}</span>`;
}
function usageRegisterNoteHtml(vocab) {
  const note = vocab?.usageRegister?.usageNoteItalian;
  if (!note) return '';
  return `<div class="register-note-box"><p>${escapeHtml(note)}</p></div>`;
}
function usageRegisterFeedbackHtml(vocab) {
  const reg = vocab?.usageRegister;
  if (!reg?.labelItalian) return '';
  return `<div class="register-feedback">${usageRegisterBadgeHtml(vocab)}${reg.usageNoteItalian ? `<p>${escapeHtml(reg.usageNoteItalian)}</p>` : ''}</div>`;
}
const formatMinutes = seconds => Math.max(1, Math.ceil(seconds / 60));
const greeting = (now = new Date()) => {
  const h = new Date(now).getHours();
  if (h >= 5 && h < 11) return 'おはよう';
  if (h >= 11 && h < 18) return 'こんにちは';
  return 'こんばんは';
};
const japaneseDateLabel = (now = new Date()) => {
  const d = new Date(now);
  const weekdays = ['日','月','火','水','木','金','土'];
  return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
};

function millisecondsUntilNextLocalMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return Math.max(250, next.getTime() - now.getTime());
}

function refreshForDayChange() {
  const currentKey = localDateKey();
  const changed = currentKey !== observedDayKey;
  observedDayKey = currentKey;
  scheduleMidnightRefresh();
  // Never interrupt an exercise already in progress. Home refreshes immediately;
  // completing a cross-midnight daily session keeps the date on which it started.
  if (changed && view === 'home' && !runtime) render();
}

function scheduleMidnightRefresh() {
  if (midnightTimer) clearTimeout(midnightTimer);
  midnightTimer = setTimeout(refreshForDayChange, millisecondsUntilNextLocalMidnight() + 250);
}

window.addEventListener('focus', () => {
  refreshForDayChange();
  resumeSessionTimingIfVisible();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') pauseSessionTimingForBackground();
  else {
    refreshForDayChange();
    resumeSessionTimingIfVisible();
  }
});
window.addEventListener('pagehide', pauseSessionTimingForBackground);
window.addEventListener('beforeunload', pauseSessionTimingForBackground);

function nav(active) {
  if (['session', 'session-complete', 'kana-exercise', 'kana-complete', 'onboarding'].includes(view)) return '';
  const items = [
    ['home', 'Home'], ['topics', 'Argomenti'], ['progress', 'Progressi'], ['kana', 'Kana'], ['settings', 'Impostazioni']
  ];
  return `<nav class="bottom-nav" aria-label="Navigazione principale">
    ${items.map(([id, label]) => `<button class="nav-item ${active === id ? 'active' : ''}" data-nav="${id}">
      <span class="nav-dot" aria-hidden="true"></span><span>${label}</span>
    </button>`).join('')}
  </nav>`;
}

let captureMode = false;
let capturedMainContent = '';
const mainViewContentCache = new Map();

function shell(content, active = view) {
  if (captureMode) {
    capturedMainContent = content;
    return;
  }
  if (['home', 'topics', 'progress', 'kana', 'settings'].includes(active)) {
    mainViewContentCache.set(active, content);
  }
  document.body.classList.toggle('kotoba-exercise-viewport', active === 'session');
  root.innerHTML = `<div class="app-shell"><main class="screen screen-${active}">${content}</main>${nav(active)}${renderResetDialog()}</div>`;
  bindCommon();
}

function renderResetDialog() {
  if (!resetDialogOpen) return '';
  return `<div class="dialog-backdrop" role="presentation">
    <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title">
      <h2 id="reset-title">Resettare tutti i progressi?</h2>
      <p>Verranno cancellati progressi, cronologia, sessioni e impostazioni locali. Questa azione non può essere annullata.</p>
      <div class="dialog-actions">
        <button class="btn secondary" data-action="cancel-reset">Annulla</button>
        <button class="btn danger" data-action="confirm-reset">Resetta</button>
      </div>
    </section>
  </div>`;
}

const MAIN_NAV_VIEWS = ['home', 'topics', 'progress', 'kana', 'settings'];
const SWIPE_SETTLE_MS = 240;

function captureMainViewContent(targetView, preferCache = true) {
  if (preferCache && mainViewContentCache.has(targetView)) {
    return mainViewContentCache.get(targetView);
  }
  const previousView = view;
  const previousCapture = captureMode;
  const previousContent = capturedMainContent;
  captureMode = true;
  capturedMainContent = '';
  view = targetView;
  try {
    if (targetView === 'home') renderHome();
    else if (targetView === 'topics') renderTopics();
    else if (targetView === 'kana') renderKana();
    else if (targetView === 'progress') renderProgress();
    else if (targetView === 'settings') renderSettings();
    const result = capturedMainContent;
    mainViewContentCache.set(targetView, result);
    return result;
  } finally {
    view = previousView;
    captureMode = previousCapture;
    if (previousCapture) capturedMainContent = previousContent;
  }
}

function bindSwipeNavigation() {
  const shellEl = document.querySelector('.app-shell');
  const currentScreen = shellEl?.querySelector(':scope > .screen');
  if (!shellEl || !currentScreen || !MAIN_NAV_VIEWS.includes(view) || resetDialogOpen) return;

  let startX = null, startY = null, startAt = 0;
  let lastX = null, lastAt = 0;
  let gestureMode = null; // null | horizontal | vertical | edge
  let targetView = null;
  let direction = 0; // -1 next, +1 previous
  let preview = null;
  let currentDx = 0;
  let suppressClickUntil = 0;

  const clearInlineMotion = () => {
    currentScreen.style.transform = '';
    currentScreen.style.transition = '';
    preview?.remove();
    preview = null;
    shellEl.classList.remove('swipe-dragging', 'swipe-settling');
  };

  const createPreview = () => {
    if (!targetView || preview) return;
    const html = captureMainViewContent(targetView);
    preview = document.createElement('main');
    preview.className = 'screen swipe-preview';
    preview.setAttribute('aria-hidden', 'true');
    preview.innerHTML = html;
    shellEl.insertBefore(preview, shellEl.querySelector('.bottom-nav'));
    const width = Math.max(1, shellEl.clientWidth);
    preview.style.transform = `translate3d(${direction < 0 ? width : -width}px,0,0)`;
  };

  const applyDrag = dx => {
    const width = Math.max(1, shellEl.clientWidth);
    if (gestureMode === 'edge') {
      currentDx = dx * 0.18;
      currentScreen.style.transform = `translate3d(${currentDx}px,0,0)`;
      return;
    }
    // Once a neighbouring page is chosen, keep the gesture on that side.
    currentDx = direction < 0 ? Math.min(0, dx) : Math.max(0, dx);
    currentScreen.style.transform = `translate3d(${currentDx}px,0,0)`;
    if (preview) {
      const base = direction < 0 ? width : -width;
      preview.style.transform = `translate3d(${base + currentDx}px,0,0)`;
    }
  };

  const settle = commit => {
    if (gestureMode !== 'horizontal' && gestureMode !== 'edge') {
      clearInlineMotion();
      return;
    }
    const width = Math.max(1, shellEl.clientWidth);
    shellEl.classList.remove('swipe-dragging');
    shellEl.classList.add('swipe-settling');
    suppressClickUntil = Date.now() + SWIPE_SETTLE_MS + 100;

    if (commit && targetView && preview) {
      currentScreen.style.transform = `translate3d(${direction < 0 ? -width : width}px,0,0)`;
      preview.style.transform = 'translate3d(0,0,0)';
      const nextView = targetView;
      setTimeout(() => {
        view = nextView;
        feedback = null;
        // Do not remove the preview before rendering the destination. The DOM is
        // replaced atomically by render(), so the user keeps seeing the arrived
        // page while any destination calculations finish.
        render();
      }, SWIPE_SETTLE_MS);
    } else {
      currentScreen.style.transform = 'translate3d(0,0,0)';
      if (preview) preview.style.transform = `translate3d(${direction < 0 ? width : -width}px,0,0)`;
      setTimeout(clearInlineMotion, SWIPE_SETTLE_MS);
    }
  };

  shellEl.addEventListener('click', event => {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  shellEl.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || shellEl.classList.contains('swipe-settling')) return;
    const target = event.target;
    if (target.closest('input, textarea, select, [contenteditable="true"], .dialog-backdrop, .bottom-nav')) return;
    const t = event.touches[0];
    startX = lastX = t.clientX;
    startY = t.clientY;
    startAt = lastAt = performance.now();
    gestureMode = null;
    targetView = null;
    direction = 0;
    currentDx = 0;
  }, { passive: true });

  shellEl.addEventListener('touchmove', event => {
    if (startX === null || event.touches.length !== 1) return;
    const t = event.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    lastX = t.clientX;
    lastAt = performance.now();

    if (gestureMode === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx) * 1.12) {
        gestureMode = 'vertical';
        return;
      }
      if (Math.abs(dx) <= Math.abs(dy) * 1.12) return;
      direction = dx < 0 ? -1 : 1;
      const currentIndex = MAIN_NAV_VIEWS.indexOf(view);
      const targetIndex = currentIndex + (direction < 0 ? 1 : -1);
      if (targetIndex < 0 || targetIndex >= MAIN_NAV_VIEWS.length) {
        gestureMode = 'edge';
      } else {
        gestureMode = 'horizontal';
        targetView = MAIN_NAV_VIEWS[targetIndex];
        createPreview();
      }
      shellEl.classList.add('swipe-dragging');
    }

    if (gestureMode === 'horizontal' || gestureMode === 'edge') {
      event.preventDefault();
      applyDrag(dx);
    }
  }, { passive: false });

  shellEl.addEventListener('touchend', event => {
    if (startX === null) return;
    const now = performance.now();
    const endX = event.changedTouches.length ? event.changedTouches[0].clientX : lastX;
    const dx = endX - startX;
    const width = Math.max(1, shellEl.clientWidth);
    const elapsed = Math.max(1, now - startAt);
    const velocity = Math.abs(dx) / elapsed;
    const commit = gestureMode === 'horizontal' && (Math.abs(currentDx) >= width * 0.24 || (Math.abs(currentDx) >= 42 && velocity >= 0.42));
    startX = startY = null;
    settle(commit);
  }, { passive: true });

  shellEl.addEventListener('touchcancel', () => {
    if (startX === null) return;
    startX = startY = null;
    settle(false);
  }, { passive: true });
}

function bindCommon() {
  document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => {
    view = btn.dataset.nav;
    feedback = null;
    render();
  }));
  document.querySelector('[data-action="cancel-reset"]')?.addEventListener('click', () => { resetDialogOpen = false; render(); });
  document.querySelector('[data-action="confirm-reset"]')?.addEventListener('click', () => {
    state = resetState();
    resetDialogOpen = false;
    view = 'home';
    onboardingStep = 1;
    runtime = null;
    feedback = null;
    selectedOption = null;
    learnDecisionMode = null;
    excludedManagerOpen = false;
    settingsOpenSection = null;
    advancedDailyOpen = false;
    freeFinishDialogOpen = false;
    excludedSelection.clear();
    excludedSearch = '';
    answerStartedAt = null;
    render();
  });
  bindSwipeNavigation();
}

// 3.1.8 dedicated free-session planner: setup is remembered, not hard-coded.
function renderFreeConfig() {
  const settings = state.settings;
  const exercises = Math.max(10, Math.min(60, Number(settings.freeExercises) || 20));
  const maxNew = Math.floor(exercises / 2);
  const selectedNew = Math.max(0, Math.min(maxNew, Number(settings.freeNew) || 0));
  const availableNew = eligibleNewWordsByStudyLevel(vocabulary, state, settings.selectedTopics || []).words.length;
  const activeCount = activeVocabularyIds(state).length;
  const preview = buildFreeSession(vocabulary, state, new Date(), true);
  shell(`
    <header class="page-header"><p class="eyebrow">SESSIONE PERSONALIZZATA</p><h1>Studio libero</h1><p class="field-help">Scegli quante domande svolgere e quante parole nuove incontrare. La configurazione rimane salvata per la prossima volta.</p></header>
    <section class="panel free-settings-panel">
      <div class="setting-inline-heading"><label class="field-label" for="free-exercises">Numero di esercizi</label><strong id="free-exercises-value">${exercises}</strong></div>
      <input class="study-range" type="range" id="free-exercises" min="10" max="60" step="5" value="${exercises}">
      <div class="range-ends"><span>10</span><span>60</span></div>
      <div class="setting-inline-heading"><label class="field-label" for="free-new">Parole nuove</label><strong id="free-new-value">${selectedNew}</strong></div>
      <input class="study-range" type="range" id="free-new" min="0" max="${maxNew}" step="1" value="${selectedNew}" ${availableNew ? '' : 'disabled'}>
      <div class="range-ends"><span>Solo ripasso</span><span>Fino a <span id="free-new-limit">${maxNew}</span> nuove</span></div>
      <p class="field-help">Ogni nuova parola ha una scheda introduttiva e fino a due esercizi (IT → JP e JP → IT). Le schede non contano nel totale.</p>
    </section>
    <section class="panel free-preview">
      <h2>Anteprima della sessione</h2>
      <div class="today-grid"><div><strong>${preview.newCount}</strong><span>nuove parole</span></div><div><strong>${preview.reviewCount}</strong><span>esercizi di ripasso</span></div></div>
      <p><strong>${preview.items.filter(i => i.type === 'question').length}</strong> esercizi disponibili · ≈ ${formatMinutes(preview.estimatedSeconds)} min</p>
      ${preview.capMessage ? `<p class="notice">${escapeHtml(preview.capMessage)}</p>` : ''}
      <p class="field-help">Le risposte aggiornano la padronanza ma non consumano i ripassi riservati alla sessione quotidiana. Puoi mettere in pausa o concludere prima, salvando i risultati.</p>
      <button class="btn primary wide" data-action="start-free" ${preview.items.length ? '' : 'disabled'}>Inizia studio libero</button>
      <button class="btn tertiary wide" data-action="cancel-free" style="margin-top:8px">Torna alla Home</button>
    </section>
    ${!availableNew && activeCount ? '<p class="field-help">Nessuna nuova parola disponibile per gli argomenti selezionati: puoi comunque ripassare.</p>' : ''}
  `, 'home');
  if (captureMode) return;
  const exerciseInput = document.querySelector('#free-exercises');
  const newInput = document.querySelector('#free-new');
  const updateLabels = () => {
    const n = Number(exerciseInput.value);
    const newMax = Math.floor(n / 2);
    newInput.max = String(newMax);
    if (Number(newInput.value) > newMax) newInput.value = String(newMax);
    document.querySelector('#free-exercises-value').textContent = String(n);
    document.querySelector('#free-new-value').textContent = newInput.value;
    document.querySelector('#free-new-limit').textContent = String(newMax);
  };
  exerciseInput.addEventListener('input', updateLabels);
  newInput.addEventListener('input', updateLabels);
  const saveChoices = () => {
    settings.freeExercises = Math.max(10, Math.min(60, Number(exerciseInput.value)));
    settings.freeNew = Math.max(0, Math.min(Math.floor(settings.freeExercises / 2), Number(newInput.value)));
    saveState(state);
    mainViewContentCache.clear();
  };
  exerciseInput.addEventListener('change', () => { saveChoices(); renderFreeConfig(); });
  newInput.addEventListener('change', () => { saveChoices(); renderFreeConfig(); });
  document.querySelector('[data-action="start-free"]')?.addEventListener('click', () => {saveChoices(); startSession('free'); });
  document.querySelector('[data-action="cancel-free"]')?.addEventListener('click', () => {view='home'; render();});
}

function openFreeConfig() {
  if (state.activeSession) return resumeSavedSession();
  runtime = null;
  view = 'free-config';
  renderFreeConfig();
}

function freeFinishDialogHtml() {
  if (!freeFinishDialogOpen || !runtime || runtime.mode === 'daily') return '';
  return `<div class="dialog-backdrop" role="presentation"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="free-finish-heading">
    <h2 id="free-finish-heading">Concludere lo studio libero?</h2>
    <p>Le risposte già completate e il tempo studiato verranno salvati. Gli esercizi non svolti non saranno considerati errori.</p>
    <div class="dialog-actions"><button class="btn secondary" data-action="cancel-free-finish">Continua a studiare</button><button class="btn primary" data-action="confirm-free-finish">Concludi e salva</button></div>
  </section></div>`;
}


function renderHome() {
  const stats = computeStats(vocabulary, state);
  const preview = buildDailySession(vocabulary, state, new Date(), true);
  const dailyDone = hasCompletedDailyToday(state);
  const pausedSession = state.activeSession && Array.isArray(state.activeSession.items) && state.activeSession.items.length
    ? state.activeSession
    : null;
  const needsDailySetup = !state.onboardingComplete;
  const canStartDaily = !needsDailySetup && !pausedSession && !dailyDone && preview.items.length > 0;
  const activeCount = activeVocabularyIds(state).length;
  const goal = dailyGoalProgress(state);
  const studiedMinutes = Math.floor(goal.studiedSeconds / 60);
  const unseenSelected = eligibleNewWordsByStudyLevel(vocabulary, state, state.settings.selectedTopics || []).words.length;
  const noDailyContent = !needsDailySetup && !dailyDone && preview.items.length === 0;
  shell(`
    <header class="home-hero">
      <p class="eyebrow">VOCABOLARIO GIAPPONESE</p>
      <h1 class="jp-greeting" lang="ja">${greeting()}</h1>
      <span class="jp-date" lang="ja">${japaneseDateLabel()}</span>
      <p class="home-kicker">Un po’ alla volta, con costanza. Riprendi da dove sei arrivato.</p>
    </header>

    <section class="panel daily-goal-card">
      <div class="goal-head"><div><p class="eyebrow">OBIETTIVO DI OGGI</p><h2>${studiedMinutes} / ${state.settings.dailyGoalMinutes || 10} min</h2></div><strong>${goal.reached ? 'Raggiunto ✓' : `${goal.percent}%`}</strong></div>
      <div class="bar"><i style="width:${goal.percent}%"></i></div>
      <p class="field-help">È un obiettivo, non un limite: anche lo studio libero conta e puoi continuare quanto vuoi.</p>
    </section>

    ${pausedSession ? `<section class="today-card resume-session-card">
      <p class="eyebrow">SESSIONE IN PAUSA</p>
      <h2>${pausedSession.mode === 'free' ? 'Studio libero' : pausedSession.mode === 'extra-new' ? 'Studio di nuove parole' : pausedSession.mode === 'extra-active' ? 'Ripasso libero' : 'Sessione quotidiana'}</h2>
      <p>Hai già studiato ${formatMinutes(Object.values(pausedSession.studySecondsByDate || {}).reduce((a, b) => a + Number(b || 0), 0))} min. Riprendi dal punto in cui ti sei fermato.</p>
      <button class="btn primary wide" data-action="resume-session">Riprendi sessione</button>
    </section>` : ''}

    <section class="today-card daily-session-card">
      <p class="eyebrow">SESSIONE DI OGGI</p>
      ${needsDailySetup ? `<div class="daily-setup-intro" role="note">
        <strong>Prepara lo studio del vocabolario</strong>
        <p>Una breve guida ti aiuta a scegliere tempo, livello e argomenti. Partirà solo quando vorrai.</p>
        <button class="btn primary wide" type="button" data-action="open-daily-guide">Configura lo studio giornaliero</button>
        <p class="field-help">Vuoi esercitarti subito con hiragana o katakana? Apri la sezione <strong>Kana</strong> nel menu: non serve completare la guida.</p>
      </div>` : ''}
      <div class="today-grid">
        <div><strong>${dailyDone ? 0 : preview.newCount}</strong><span>nuovi vocaboli</span></div>
        <div><strong>${dailyDone ? 0 : preview.reviewCount}</strong><span>da ripassare</span></div>
      </div>
      <p class="session-time">${needsDailySetup ? "Tempo e parole da configurare" : `≈ ${canStartDaily ? formatMinutes(preview.estimatedSeconds) : 0} min`}</p>
      ${!dailyDone && preview.capMessage ? `<p class="notice">${escapeHtml(preview.capMessage)}</p>` : ''}
      ${!dailyDone && preview.deferredReviewCount ? `<p class="notice">${preview.deferredReviewCount} ripassi meno urgenti verranno rimandati automaticamente.</p>` : ''}
      ${noDailyContent ? `<p class="notice">La sessione di oggi non è stata completata, ma al momento non ci sono contenuti disponibili. Se hai parole già studiate puoi usare il ripasso libero; per aggiungere nuove parole seleziona altri argomenti.</p>` : ''}
      ${needsDailySetup ? '' : `<button class="btn primary wide" data-action="start-session" ${canStartDaily ? '' : 'disabled'}>${pausedSession ? 'Riprendi prima la sessione in pausa' : dailyDone ? 'Sessione quotidiana completata' : canStartDaily ? 'Inizia sessione' : 'Nessun contenuto disponibile'}</button>`}
    </section>

    <section class="panel extra-study">
      <p class="eyebrow">STUDIO LIBERO</p>
      <h2>${dailyDone ? 'Vuoi continuare?' : 'Studia quando vuoi'}</h2>
      <p>Decidi quanti esercizi fare e quante nuove parole incontrare. Puoi interrompere quando vuoi: i risultati vengono salvati senza consumare i ripassi della sessione quotidiana.</p>
      <button class="btn secondary wide" data-action="open-free" ${pausedSession || (!unseenSelected && !activeCount) ? 'disabled' : ''}>Personalizza studio libero</button>
      ${!unseenSelected && activeCount ? `<p class="field-help">Non ci sono nuove parole negli argomenti selezionati. Puoi comunque ripassare le parole attive.</p>` : ''}
    </section>


    <section class="mini-stats" aria-label="Statistiche rapide">
      <div><span>Serie</span><strong>${stats.streak} ${stats.streak === 1 ? 'giorno' : 'giorni'}</strong></div>
      <div><span>Accuratezza 7 giorni</span><strong>${stats.accuracy7}%</strong></div>
      <div><span>Vocaboli appresi</span><strong>${stats.learned}</strong></div>
    </section>
  `, 'home');
  if (captureMode) return;
  document.querySelector('[data-action="resume-session"]')?.addEventListener('click', resumeSavedSession);
  document.querySelector('[data-action="open-daily-guide"]')?.addEventListener('click', () => { onboardingStep = 1; view = 'onboarding'; render(); });
  document.querySelector('[data-action="start-session"]')?.addEventListener('click', () => startSession('daily'));
  document.querySelector('[data-action="open-free"]')?.addEventListener('click', openFreeConfig);
}

function topicCard(topic, stats, selected, interactive = true) {
  const data = stats.byTopic[topic.id] || { encountered: 0, total: 0, unseen: 0, progress: 0 };
  const countLabel = data.total
    ? `${data.encountered} / ${data.total} vocaboli · ${data.unseen} nuovi`
    : `${data.encountered} vocaboli`;
  return `<button class="topic-card ${selected ? 'selected' : ''}" ${interactive ? `data-topic="${topic.id}"` : 'disabled'}>
    <div><strong>${topic.label}</strong><span>${countLabel}</span></div>
    <div class="topic-progress"><span>${data.progress}%</span><div class="bar"><i style="width:${data.progress}%"></i></div></div>
  </button>`;
}

function renderTopics() {
  const stats = computeStats(vocabulary, state);
  shell(`
    <header class="page-header"><p class="eyebrow">STUDIO</p><h1>Argomenti</h1><p>Scegli più categorie: durante le sessioni verranno mescolate.</p></header>
    <div class="toolbar">
      <button class="text-btn" data-action="select-all">Seleziona tutti</button>
      <button class="text-btn" data-action="deselect-all">Deseleziona tutti</button>
    </div>
    <section class="topic-list">
      ${TOPICS.map(t => topicCard(t, stats, state.settings.selectedTopics.includes(t.id))).join('')}
    </section>
  `, 'topics');
  if (captureMode) return;
  document.querySelectorAll('[data-topic]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.topic;
    const set = new Set(state.settings.selectedTopics);
    set.has(id) ? set.delete(id) : set.add(id);
    state.settings.selectedTopics = [...set];
    saveState(state);
    renderTopics();
  }));
  document.querySelector('[data-action="select-all"]').addEventListener('click', () => {
    state.settings.selectedTopics = TOPICS.map(t => t.id); saveState(state); renderTopics();
  });
  document.querySelector('[data-action="deselect-all"]').addEventListener('click', () => {
    state.settings.selectedTopics = []; saveState(state); renderTopics();
  });
}

function renderProgress() {
  const stats = computeStats(vocabulary, state);
  shell(`
    <header class="page-header"><p class="eyebrow">ANDAMENTO</p><h1>Progressi</h1><p>Il progresso reale è separato per richiamo in entrambe le direzioni.</p></header>
    <section class="panel">
      <h2>Panoramica</h2>
      <div class="stat-grid">
        <div><span>Incontrati</span><strong>${stats.encountered}</strong></div>
        <div><span>Appresi</span><strong>${stats.learned}</strong></div>
        <div><span>Padroneggiati</span><strong>${stats.mastered}</strong></div>
        <div><span>Accuratezza 7 gg</span><strong>${stats.accuracy7}%</strong></div>
        <div><span>Streak</span><strong>${stats.streak}</strong></div>
      </div>
    </section>
    <section class="panel">
      <h2>Per livello</h2>
      <div class="level-list">${LEVELS.map(level => `<div><span>${level}</span><strong>${stats.byLevel[level]}</strong></div>`).join('')}</div>
    </section>
    <section class="panel">
      <h2>Per direzione</h2>
      <div class="direction-cards">
        <div><span>Italiano → Giapponese</span><strong>${stats.directionStats.itToJp.averageMastery}%</strong><small>${stats.directionStats.itToJp.learned} appresi · ${stats.directionStats.itToJp.mastered} padroneggiati</small></div>
        <div><span>Giapponese → Italiano</span><strong>${stats.directionStats.jpToIt.averageMastery}%</strong><small>${stats.directionStats.jpToIt.learned} appresi · ${stats.directionStats.jpToIt.mastered} padroneggiati</small></div>
      </div>
    </section>
    <section class="panel">
      <h2>Per argomento</h2>
      <div class="topic-progress-list">${TOPICS.map(t => {
        const d = stats.byTopic[t.id] || { encountered: 0, total: 0, unseen: 0, progress: 0 };
        const countLabel = d.total ? `${d.encountered} / ${d.total} vocaboli · ${d.unseen} nuovi` : `${d.encountered} vocaboli`;
        return `<div class="topic-progress-row"><div><strong>${t.label}</strong><span>${countLabel}</span></div><div><span>${d.progress}%</span><div class="bar"><i style="width:${d.progress}%"></i></div></div></div>`;
      }).join('')}</div>
    </section>
  `, 'progress');
  if (captureMode) return;
}

function excludedVocabularyEntries() {
  const ids = Object.keys(state.excludedVocabulary || {});
  return ids.map(id => byId(id)).filter(v => v && !isMergedSense(v)).sort((a, b) => {
    const ai = (a.italian?.[0] || a.japanese || '').toLocaleLowerCase('it-IT');
    const bi = (b.italian?.[0] || b.japanese || '').toLocaleLowerCase('it-IT');
    return ai.localeCompare(bi, 'it');
  });
}

function filteredExcludedEntries() {
  const q = normalizeItalian(excludedSearch || '');
  if (!q) return excludedVocabularyEntries();
  return excludedVocabularyEntries().filter(v => {
    const hay = [v.japanese, v.kana, ...(v.italian || []), ...(v.alternativeItalian || [])].join(' ');
    return normalizeItalian(hay).includes(q) || normalizeJapanese(hay).includes(normalizeJapanese(excludedSearch));
  });
}

function renderExcludedVocabularyManager() {
  const entries = filteredExcludedEntries();
  const total = excludedVocabularyEntries().length;
  if (!total) return `<div class="excluded-manager empty"><p>Nessuna parola esclusa.</p></div>`;
  return `<div class="excluded-manager">
    <label class="field-label" for="excluded-search">Cerca nell'elenco</label>
    <input id="excluded-search" class="search-input" type="search" value="${escapeHtml(excludedSearch)}" placeholder="Italiano o giapponese…">
    <div class="excluded-toolbar">
      <button class="text-btn" data-action="excluded-select-all">Seleziona visibili</button>
      <button class="text-btn" data-action="excluded-clear-selection">Deseleziona</button>
    </div>
    <div class="excluded-list">${entries.length ? entries.map(v => {
      const checked = excludedSelection.has(v.id) ? 'checked' : '';
      return `<label class="excluded-row">
        <input type="checkbox" data-excluded-id="${escapeHtml(v.id)}" ${checked}>
        <span class="excluded-word"><strong>${escapeHtml(v.japanese)}</strong>${v.kana ? `<small>${escapeHtml(displayReading(v))}</small>` : ''}<span>${escapeHtml((v.italian || []).join(' · '))}</span></span>
        <button type="button" class="restore-one" data-restore-id="${escapeHtml(v.id)}">Reinserisci</button>
      </label>`;
    }).join('') : `<p class="field-help">Nessuna parola corrisponde alla ricerca.</p>`}</div>
    <button class="btn primary wide restore-selected" data-action="restore-selected" ${excludedSelection.size ? '' : 'disabled'}>Reinserisci selezionate${excludedSelection.size ? ` (${excludedSelection.size})` : ''}</button>
  </div>`;
}

function restoreExcludedIds(ids) {
  for (const id of ids) {
    restoreVocabularyToStudy(state, id);
    excludedSelection.delete(id);
  }
  saveState(state);
  mainViewContentCache.clear();
  renderSettings();
}

/* Kotoba portable progress v1. Synchronous, deterministic core, shared by APK and PWA.
   The SHA-256 is for accidental corruption detection, not authentication. */
const KOTOBA_TRANSFER_FORMAT = 'kotoba-progress';
const KOTOBA_TRANSFER_SCHEMA = 1;
const KOTOBA_TRANSFER_MAX_SIZE = 25 * 1024 * 1024;
function kotobaClone(value){ return JSON.parse(JSON.stringify(value)); }
function kotobaHashString(message) {
  // UTF-8 SHA-256, pure JS to work in file-based Android WebView as well as HTTPS PWA.
  const data = new TextEncoder().encode(String(message));
  const length=data.length;
  const padded=new Uint8Array(Math.ceil((length + 9)/64)*64);
  padded.set(data); padded[length]=0x80;
  const bits=BigInt(length)*8n;
  for(let j=0;j<8;j++) padded[padded.length-1-j]=Number((bits>>BigInt(j*8))&255n);
  const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n));
  for(let off=0;off<padded.length;off+=64){
    const W=new Uint32Array(64); const d=new DataView(padded.buffer,off,64);
    for(let i=0;i<16;i++)W[i]=d.getUint32(i*4,false);
    for(let i=16;i<64;i++) W[i]=(W[i-16]+(rotr(W[i-15],7)^rotr(W[i-15],18)^(W[i-15]>>>3))+W[i-7]+(rotr(W[i-2],17)^rotr(W[i-2],19)^(W[i-2]>>>10)))>>>0;
    let [a,b,c,e,f,g,h,j]=H;
    for(let i=0;i<64;i++){
      const t1=(j+(rotr(f,6)^rotr(f,11)^rotr(f,25))+((f&g)^(~f&h))+K[i]+W[i])>>>0;
      const t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
      j=h;h=g;g=f;f=(e+t1)>>>0;e=c;c=b;b=a;a=(t1+t2)>>>0;
    }
    H=H.map((v,i)=>(v+[a,b,c,e,f,g,h,j][i])>>>0);
  }
  return H.map(x=>x.toString(16).padStart(8,'0')).join('');
}
function kotobaCheckId(id){return /^(?:jmdict-\d+-\d+|fd-[a-f\d]+)$/.test(id);}
function kotobaAnswerKey(a){
  if(a?.transferId && typeof a.transferId==='string' && a.transferId.length<=140)return a.transferId;
  return 'legacy-'+kotobaHashString(JSON.stringify([a.vocabularyId,a.direction,a.exerciseType,a.timestamp,a.answer,a.result,a.sessionMode,a.source,a.timeSpentMs]));
}
function kotobaEnsureAnswerIds(s){
  if(!Array.isArray(s.answers))s.answers=[];
  for(const a of s.answers) if(a && !a.transferId)a.transferId=kotobaAnswerKey(a);
}
function kotobaBackupCreate(appState,kana,appVersion){
  const snapshot=kotobaClone(appState); kotobaEnsureAnswerIds(snapshot);
  const body={state:snapshot,kana:kotobaClone(kana||null)};
  return {format:KOTOBA_TRANSFER_FORMAT,schemaVersion:KOTOBA_TRANSFER_SCHEMA,
    appVersion,createdAt:new Date().toISOString(),
    contentSha256:kotobaHashString(JSON.stringify(body)),payload:body};
}
function kotobaParseBackup(raw){
  if(typeof raw!=='string'||raw.length>KOTOBA_TRANSFER_MAX_SIZE)throw new Error('File troppo grande (massimo 25 MB).');
  let doc;
  try{doc=JSON.parse(raw);}catch{throw new Error('Il file non contiene un JSON valido.');}
  if(!doc||doc.format!==KOTOBA_TRANSFER_FORMAT||!Number.isInteger(doc.schemaVersion))throw new Error('File non riconosciuto come backup Kotoba.');
  if(doc.schemaVersion!==1)throw new Error('Formato backup non supportato da questa versione. Aggiorna Kotoba prima di importarlo.');
  if(!doc.payload||!doc.payload.state||typeof doc.payload.state!=='object')throw new Error('Dati dei progressi mancanti.');
  if(typeof doc.contentSha256!=='string'||kotobaHashString(JSON.stringify(doc.payload))!==doc.contentSha256)throw new Error('Controllo integrità fallito: il file potrebbe essere incompleto o modificato.');
  const s=doc.payload.state;
  if(!s.progress||typeof s.progress!=='object'||Array.isArray(s.progress)||!Array.isArray(s.answers)||!Array.isArray(s.sessions)||!s.settings||typeof s.settings!=='object')throw new Error('Il file ha una struttura di progressi non valida.');
  if(!s.excludedVocabulary||typeof s.excludedVocabulary!=='object')throw new Error('Elenco delle esclusioni non valido.');
  if(s.answers.length>100000||s.sessions.length>100000||Object.keys(s.progress).length>150000)throw new Error('Il backup supera i limiti di sicurezza.');
  for(const id of Object.keys(s.progress)) if(!kotobaCheckId(id))throw new Error('Identificativo vocabolo non valido nel backup.');
  for(const [id,v] of Object.entries(s.progress)){
    if(!v||typeof v!=='object'||Array.isArray(v))throw new Error('Progressi non validi: '+id);
    for(const dir of ['itToJp','jpToIt']) if(v[dir] && (typeof v[dir]!=='object'||Number(v[dir].masteryScore??0)<0||Number(v[dir].masteryScore??0)>100))throw new Error('Padronanza non valida: '+id);
  }
  for(const a of s.answers) if(!a||typeof a!=='object'||!kotobaCheckId(a.vocabularyId)||!['itToJp','jpToIt'].includes(a.direction))throw new Error('Risposte non valide nel backup.');
  // Do not trust dataMigrations flags from an arbitrary old app; migrations are idempotent.
  const state=kotobaClone(s);kotobaEnsureAnswerIds(state);
  return {state,kana:kotobaClone(doc.payload.kana),createdAt:doc.createdAt,appVersion:doc.appVersion};
}
function kotobaLatestActivity(s){
  const stamps=[];
  for(const a of (s.answers||[]))if(a.timestamp)stamps.push(Date.parse(a.timestamp)||0);
  for(const x of (s.sessions||[]))if(x.completedAt)stamps.push(Date.parse(x.completedAt)||0);
  for(const v of Object.values(s.excludedVocabulary||{}))if(v?.excludedAt)stamps.push(Date.parse(v.excludedAt)||0);
  return Math.max(0,...stamps);
}
function kotobaRecordEqual(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function kotobaMergePreview(local,remote,backupCreatedAt,localKana,remoteKana){
  let added=0, identical=0, conflicting=0;
  const conflicts=[];
  for(const [id,p] of Object.entries(remote.progress||{})){
    if(!Object.prototype.hasOwnProperty.call(local.progress||{},id)){added++;continue;}
    if(kotobaRecordEqual(local.progress[id],p)){identical++;continue;}
    conflicts.push(id); conflicting++;
  }
  const localExcluded=local.excludedVocabulary||{},remoteExcluded=remote.excludedVocabulary||{};
  const exclusionConflicts=[...new Set([...Object.keys(localExcluded),...Object.keys(remoteExcluded)])].filter(id=>Boolean(localExcluded[id])!==Boolean(remoteExcluded[id])&&local.progress?.[id]&&remote.progress?.[id]);
  const latestLocal=kotobaLatestActivity(local), remoteTime=Date.parse(backupCreatedAt)||0;
  const hasLocalKana=Boolean(localKana?.lastResult||localKana?.activeSession);
  const hasRemoteKana=Boolean(remoteKana?.lastResult||remoteKana?.activeSession);
  return {added,identical,conflicting,conflicts,exclusionConflicts,older:remoteTime>0&&latestLocal>remoteTime,
    localWords:Object.keys(local.progress||{}).length,importWords:Object.keys(remote.progress||{}).length,
    kanaConflict:hasLocalKana&&hasRemoteKana&&!kotobaRecordEqual(localKana,remoteKana),
    sessionConflict:Boolean(local.activeSession&&remote.activeSession&&!kotobaRecordEqual(local.activeSession,remote.activeSession))};
}
function kotobaMergeFinish(local,remote,option,localKana,remoteKana){
  // Explicit policy on divergence: preserve local or prefer file, never sum SRS counters.
  if(!['keep-local','prefer-file','replace'].includes(option))throw new Error('Scelta di importazione non valida.');
  if(option==='replace')return {state:kotobaClone(remote),kana:kotobaClone(remoteKana)};
  const incoming=kotobaClone(remote),current=kotobaClone(local),keepIncoming=new Set();
  const keys=new Set([...Object.keys(current.progress||{}),...Object.keys(incoming.progress||{})]);
  current.progress=current.progress||{};
  for(const id of keys){
    if(!current.progress[id]){current.progress[id]=incoming.progress[id];keepIncoming.add(id);}
    else if(incoming.progress[id] && !kotobaRecordEqual(current.progress[id],incoming.progress[id]) && option==='prefer-file'){
      current.progress[id]=incoming.progress[id];keepIncoming.add(id);
    }
  }
  const localAnswers=current.answers||[], importAnswers=incoming.answers||[];
  const all=new Map();
  for(const a of localAnswers){if(!keepIncoming.has(a.vocabularyId))all.set(kotobaAnswerKey(a),a);}
  for(const a of importAnswers){if(keepIncoming.has(a.vocabularyId)||!Object.prototype.hasOwnProperty.call(local.progress||{},a.vocabularyId))all.set(kotobaAnswerKey(a),a);}
  current.answers=[...all.values()].sort((a,b)=>String(a.timestamp).localeCompare(String(b.timestamp))).slice(-5000);
  // User activity summaries are merged by stable, content-derived key, not summed twice.
  const sessions=new Map();
  for(const x of [...(local.sessions||[]),...(incoming.sessions||[])]){
    const key=kotobaHashString(JSON.stringify([x.startedAt,x.completedAt,x.mode,x.answers,x.durationSeconds]));
    if(!sessions.has(key))sessions.set(key,x);
  }
  current.sessions=[...sessions.values()].sort((a,b)=>String(a.completedAt).localeCompare(String(b.completedAt))).slice(-365);
  current.excludedVocabulary=current.excludedVocabulary||{};
  for(const id of new Set([...Object.keys(current.excludedVocabulary),...Object.keys(incoming.excludedVocabulary||{})])){
    if(keepIncoming.has(id)||(!local.progress?.[id]&&incoming.excludedVocabulary?.[id])){
      if(incoming.excludedVocabulary?.[id])current.excludedVocabulary[id]=incoming.excludedVocabulary[id];
      else delete current.excludedVocabulary[id];
    }
  }
  current.sensePriorityUnlocks={...(incoming.sensePriorityUnlocks||{}),...(current.sensePriorityUnlocks||{})};
  current.dataMigrations={...(incoming.dataMigrations||{}),...(current.dataMigrations||{})};
  const hasLocalStudy=Object.values(local.progress||{}).some(v=>v&&v.introducedAt);
  if(!hasLocalStudy&&!(local.sessions||[]).length) current.settings=incoming.settings;
  if(!current.activeSession)current.activeSession=incoming.activeSession||null;
  else if(incoming.activeSession&&option==='prefer-file')current.activeSession=incoming.activeSession;
  const localHasKana=Boolean(localKana?.lastResult||localKana?.activeSession);
  const mergedKana= !localHasKana||option==='prefer-file' ? (remoteKana||localKana) : localKana;
  return {state:current,kana:kotobaClone(mergedKana)};
}

/* UI for portable progress: deliberately no cloud connection. */
let transferPending=null;
let transferBusy=false;
let transferNotice='';
function renderTransferSettings(){
  const p=transferPending;
  return `<details class="settings-disclosure" data-settings-section="transfer" ${settingsOpenSection==='transfer'?'open':''}>
  <summary><span><strong>Backup e trasferimento</strong><small>Esporta e importa progressi tra dispositivi</small></span><span class="disclosure-arrow" aria-hidden="true">⌄</span></summary>
  <div class="settings-disclosure-body">
    <p class="field-help">Salva un file sul dispositivo e importalo su un altro iPhone, Android o computer. Nessun account o cloud richiesto.</p>
    <button type="button" class="btn secondary wide" data-action="transfer-export">Esporta progressi (.json)</button>
    ${window.__KOTOBA_ANDROID_WRAPPER__?`<p class="notice transfer-warning">Questa versione del contenitore Android non gestisce ancora il selettore e il download dei file. Puoi usare il trasferimento tramite testo JSON come alternativa, oppure la PWA per scaricare il file. Non considerare completato il salvataggio finché non hai conservato il testo.</p>
      <button type="button" class="btn secondary wide" data-action="transfer-copy" style="margin:10px 0">Copia backup negli appunti</button>
      <label class="field-label" for="kotoba-paste-file">Oppure incolla il contenuto JSON di un backup</label>
      <textarea id="kotoba-paste-file" rows="3" style="width:100%;min-height:90px;max-width:100%;font:13px monospace;padding:8px;border:1px solid var(--line);border-radius:8px" placeholder="Incolla il testo del file .json"></textarea>
      <button type="button" class="btn secondary wide" data-action="transfer-paste">Analizza backup incollato</button>`:''}
    <p class="field-help">Il file comprende le due direzioni, ripassi, sessioni, parole escluse, impostazioni e progressi Kana. Conservane una copia in un luogo sicuro.</p>
    <label class="field-label" for="kotoba-import-file">Importa progressi da un file</label>
    <input id="kotoba-import-file" type="file" accept="application/json,.json" aria-label="Seleziona un backup Kotoba" style="width:100%;max-width:100%;padding:12px 0;">
    ${transferNotice?`<p class="notice" role="status">${escapeHtml(transferNotice)}</p>`:''}
    ${p?`<div class="transfer-comparison">
      <h3>Anteprima dell'importazione</h3>
      <p class="field-help">File: ${escapeHtml(p.fileName)} · Creato: ${escapeHtml(p.doc.createdAt||'data sconosciuta')}</p>
      ${p.preview.older?'<p class="notice transfer-warning"><strong>Attenzione:</strong> il backup è precedente alle attività già presenti su questo dispositivo.</p>':''}
      <div class="transfer-counts"><span>Parole aggiuntive <strong>${p.preview.added}</strong></span><span>Già identiche <strong>${p.preview.identical}</strong></span><span>Conflitti <strong>${p.preview.conflicting}</strong></span></div>
      ${(p.preview.conflicting||p.preview.exclusionConflicts.length||p.preview.kanaConflict||p.preview.sessionConflict)?'<p class="notice transfer-warning">Esistono progressi differenti per le stesse parole o attività. I punteggi SRS non verranno sommati. Scegli esplicitamente quali dati conservare nei conflitti.</p>':'<p class="field-help">L’integrazione non rileva differenze fra i progressi condivisi. I nuovi dati possono essere aggiunti senza sostituzioni.</p>'}
      <button type="button" class="btn primary wide" data-action="transfer-merge-local" ${transferBusy?'disabled':''}>Integra, mantieni i progressi locali nei conflitti</button>
      <button type="button" class="btn secondary wide" data-action="transfer-merge-file" ${transferBusy?'disabled':''} style="margin-top:9px">Integra, preferisci il file nei conflitti</button>
      <details class="nested-advanced"><summary>Ripristino completo (avanzato)</summary><p class="field-help">Sostituisce interamente lo stato locale con il backup, comprese impostazioni e sessioni. Questa operazione richiede conferma.</p><button type="button" class="btn danger-outline wide" data-action="transfer-replace" ${transferBusy?'disabled':''}>Sostituisci con il file</button></details>
      <button type="button" class="text-btn" data-action="transfer-cancel" style="margin-top:14px">Annulla importazione</button>
    </div>`:''}
    <details class="nested-advanced"><summary>Protezione e compatibilità</summary><p class="field-help">L’esportazione usa un formato versionato indipendente dall’app e un checksum SHA-256 contro danneggiamenti accidentali. I backup creati dalla 3.1.9 potranno essere importati dalle versioni successive compatibili. Un backup più recente non supportato non viene caricato.</p><p class="field-help">Prima di ogni importazione viene salvata una copia di sicurezza locale. In presenza di storie divergenti della stessa parola l'app chiede quale stato mantenere: non somma contatori che potrebbero riferirsi alle stesse risposte.</p></details>
  </div></details>`;
}
async function kotobaExportProgress(){
  try {
    persistActiveSession(true);
    if(kanaRuntime)saveKanaState();
    const doc=kotobaBackupCreate(state,kanaState,KOTOBA_RELEASE.split('-')[0]);
    const fileName='kotoba-progressi-'+new Date().toISOString().slice(0,10)+'.json';
    const file=new File([JSON.stringify(doc,null,2)],fileName,{type:'application/json'});
    if(typeof navigator.canShare==='function'&&navigator.canShare({files:[file]})&&typeof navigator.share==='function'){
      try{await navigator.share({files:[file],title:'Backup Kotoba'});transferNotice='Condivisione del backup avviata.';renderSettings();return;}
      catch(e){if(e.name==='AbortError')return;}
    }
    const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=fileName;a.textContent='Salva backup';a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    transferNotice='Download richiesto. Verifica che il file sia presente nei Download o nei File del dispositivo.';
  }catch(e){transferNotice='Impossibile esportare: '+(e.message||String(e));}
  renderSettings();
}
async function kotobaChooseImportFile(file){
  transferPending=null;
  if(!file)return;
  try {
    if(file.size>KOTOBA_TRANSFER_MAX_SIZE)throw new Error('File oltre 25 MB.');
    const doc=kotobaParseBackup(await file.text());
    const report=kotobaMergePreview(state,doc.state,doc.createdAt,kanaState,doc.kana);
    transferPending={doc,preview:report,fileName:file.name};
    transferNotice=report.older?'Backup precedente ai progressi locali: controlla attentamente le opzioni.':'File valido e integro.';
  }catch(e){transferNotice='Importazione annullata: '+(e.message||String(e));}
  settingsOpenSection='transfer';renderSettings();
}
async function kotobaConfirmImport(choice){
  const pending=transferPending;
  if(!pending||transferBusy)return;
  if(choice==='replace' && !window.confirm('Attenzione: sostituirai tutti i progressi locali con quelli del file. Continuare?'))return;
  transferBusy=true;
  try{
    const result=kotobaMergeFinish(state,pending.doc.state,choice,kanaState,pending.doc.kana);
    if(!result.state||!result.state.progress)throw new Error('Risultato importazione non valido.');
    // Migrate aliases and preserve unknown older IDs with the compatibility index.
    result.state=migrateEquivalentVocabularyState(result.state);
    const preImport=kotobaBackupCreate(state,kanaState,KOTOBA_RELEASE.split('-')[0]);
    const nextState=JSON.stringify(result.state),nextKana=JSON.stringify(result.kana||defaultKanaState());
    const idb=window.__KOTOBA_IDB_API__;
    if(idb){
      await idb.importState(preImport,result.state,JSON.parse(nextKana));
    }else{
      // Do not begin a destructive import unless its recovery copy is durably saved.
      const oldMain=localStorage.getItem(STORAGE_KEY),oldKana=localStorage.getItem(KANA_STORAGE_KEY);
      localStorage.setItem('kotoba-pre-import-backup-v1',JSON.stringify(preImport));
      try{localStorage.setItem(STORAGE_KEY,nextState);localStorage.setItem(KANA_STORAGE_KEY,nextKana);}
      catch(e){if(oldMain!==null)localStorage.setItem(STORAGE_KEY,oldMain);else localStorage.removeItem(STORAGE_KEY);
        if(oldKana!==null)localStorage.setItem(KANA_STORAGE_KEY,oldKana);else localStorage.removeItem(KANA_STORAGE_KEY);throw e;}
    }
    window.alert('Importazione completata. Kotoba riavvierà l’interfaccia per caricare i progressi integrati.');
    window.location.reload();
  }catch(e){ transferNotice='Importazione non eseguita: '+(e.message||String(e));transferBusy=false;settingsOpenSection='transfer';renderSettings(); }
}
function bindTransferSettings(){
  document.querySelector('[data-action="transfer-export"]')?.addEventListener('click',kotobaExportProgress);
  document.querySelector('[data-action="transfer-copy"]')?.addEventListener('click',kotobaCopyBackupText);
  document.querySelector('[data-action="transfer-paste"]')?.addEventListener('click',()=>kotobaPasteBackupText(document.querySelector('#kotoba-paste-file')?.value||''));
  document.querySelector('#kotoba-import-file')?.addEventListener('change',e=>kotobaChooseImportFile(e.target.files?.[0]));
  document.querySelector('[data-action="transfer-merge-local"]')?.addEventListener('click',()=>kotobaConfirmImport('keep-local'));
  document.querySelector('[data-action="transfer-merge-file"]')?.addEventListener('click',()=>kotobaConfirmImport('prefer-file'));
  document.querySelector('[data-action="transfer-replace"]')?.addEventListener('click',()=>kotobaConfirmImport('replace'));
  document.querySelector('[data-action="transfer-cancel"]')?.addEventListener('click',()=>{transferPending=null;transferNotice='';renderSettings()});
}

async function kotobaCopyBackupText(){
  try{
    persistActiveSession(true);if(kanaRuntime)saveKanaState();
    const content=JSON.stringify(kotobaBackupCreate(state,kanaState,KOTOBA_RELEASE.split('-')[0]));
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(content);
    else{
      const area=document.createElement('textarea');area.value=content;area.style.position='fixed';area.style.left='-9999px';document.body.appendChild(area);area.select();
      if(!document.execCommand('copy'))throw new Error('La copia negli appunti non è supportata.');area.remove();
    }
    transferNotice='Testo del backup copiato. Salvalo in un documento .json prima di cancellare gli appunti.';
  }catch(e){transferNotice='Non è stato possibile copiare il backup: '+(e.message||String(e));}
  settingsOpenSection='transfer';renderSettings();
}
function kotobaPasteBackupText(raw){
  transferPending=null;
  try{
    const doc=kotobaParseBackup(raw);
    const report=kotobaMergePreview(state,doc.state,doc.createdAt,kanaState,doc.kana);
    transferPending={doc,preview:report,fileName:'Testo incollato'};
    transferNotice=report.older?'Backup meno recente delle attività locali.': 'Backup valido e integro.';
  }catch(e){transferNotice='Testo non importato: '+(e.message||String(e));}
  settingsOpenSection='transfer';renderSettings();
}


function renderSettings() {
  const setting = state.settings;
  const balance = dailyBalanceIndex(setting);
  const limitOn = setting.dailyNewLimit != null;
  const displayedLimit = limitOn ? setting.dailyNewLimit : Math.max(0, Number(setting.newPerDay ?? 10));
  shell(`
    <header class="page-header"><p class="eyebrow">PREFERENZE</p><h1>Impostazioni</h1><p class="field-help">Tocca una sezione per modificare le preferenze o leggere le spiegazioni.</p></header>
    <div id="kotoba-storage-error" role="alert"></div><div class="settings-stack">
      <details class="settings-disclosure" data-settings-section="daily" ${settingsOpenSection === 'daily' ? 'open' : ''}>
        <summary><span><strong>Studio quotidiano</strong><small>${setting.dailyGoalMinutes || 10} min · ${DAILY_BALANCE_LABELS[balance]}</small></span><span class="disclosure-arrow" aria-hidden="true">⌄</span></summary>
        <div class="settings-disclosure-body">
          <label class="field-label" for="daily-goal-minutes">Tempo della sessione quotidiana (minuti)</label>
          <input class="number-input" id="daily-goal-minutes" type="number" min="1" max="180" step="1" inputmode="numeric" value="${setting.dailyGoalMinutes || 10}">
          <p class="field-help">Durata indicativa della sessione quotidiana, indipendente dagli esercizi liberi. Non è un limite di studio.</p>
          <div class="setting-inline-heading"><label class="field-label" for="daily-balance">Bilanciamento</label><strong id="daily-balance-label">${DAILY_BALANCE_LABELS[balance]}</strong></div>
          <input class="study-range" id="daily-balance" type="range" min="0" max="4" step="1" value="${balance}">
          <div class="range-ends"><span>Solo ripasso</span><span>Solo nuove</span></div>
          <p class="field-help">Al centro: circa 40% del tempo alle nuove parole e 60% ai ripassi. Nei due estremi studi soltanto il tipo scelto. Se mancano contenuti l'app usa quelli disponibili.</p>
          <details class="nested-advanced" data-settings-advanced ${advancedDailyOpen ? 'open' : ''}>
            <summary>Opzioni avanzate</summary>
            <div class="advanced-settings-body">
              <label class="switch-label"><input id="daily-limit-enabled" type="checkbox" ${limitOn ? 'checked' : ''}> Limita il numero di nuove parole al giorno</label>
              ${limitOn ? `<label class="field-label" for="daily-limit-value">Massimo nuove parole quotidiane</label>
                <input class="number-input" id="daily-limit-value" type="number" min="0" max="200" step="1" inputmode="numeric" value="${displayedLimit}">` : '<p class="field-help">Automatico: il numero dipende dal tempo e dal bilanciamento.</p>'}
              <p class="field-help">Questo limite riguarda soltanto la sessione quotidiana; lo studio libero non lo consuma. I valori delle vecchie installazioni vengono conservati qui.</p>
            </div>
          </details>
        </div>
      </details>
      <details class="settings-disclosure" data-settings-section="level" ${settingsOpenSection === 'level' ? 'open' : ''}>
        <summary><span><strong>Livello di studio</strong><small>${studyLevelChoiceLabel(setting.studyLevel)}</small></span><span class="disclosure-arrow" aria-hidden="true">⌄</span></summary>
        <div class="settings-disclosure-body">
          <label class="field-label" for="study-level">Livello di giapponese</label>
          <select class="select-input" id="study-level" aria-label="Livello di giapponese">${STUDY_LEVELS.map(level => `<option value="${level}" ${setting.studyLevel === level ? 'selected' : ''}>${studyLevelChoiceLabel(level)}</option>`).join('')}</select>
          <p class="field-help">Le nuove parole privilegiano il livello scelto e quelli più facili, ordinati per priorità didattica. Il livello successivo entra gradualmente dopo il consolidamento delle basi. I riferimenti N5–N1 sono indicativi, non liste JLPT ufficiali.</p>
        </div>
      </details>
      <details class="settings-disclosure" data-settings-section="exercise" ${settingsOpenSection === 'exercise' ? 'open' : ''}>
        <summary><span><strong>Modalità esercizi</strong><small>Adattiva</small></span><span class="disclosure-arrow" aria-hidden="true">⌄</span></summary>
        <div class="settings-disclosure-body">
          <p>La difficoltà si adatta al livello di apprendimento in ciascuna direzione:</p>
          <p class="field-help">Nuovo e In apprendimento: scelta multipla. In consolidamento e Quasi appreso: esercizi misti. Appreso e Padroneggiato: risposta libera.</p>
          <p class="field-help">JP → IT mostra la lettura in hiragana con i kanji. In IT → JP puoi rispondere con kanji, kana o romaji nelle domande a risposta libera.</p>
        </div>
      </details>
      <details class="settings-disclosure" data-settings-section="excluded" ${settingsOpenSection === 'excluded' ? 'open' : ''}>
        <summary><span><strong>Parole escluse</strong><small>${Object.keys(state.excludedVocabulary || {}).length} parole · Visualizza e gestisci</small></span><span class="disclosure-arrow" aria-hidden="true">⌄</span></summary>
        <div class="settings-disclosure-body">
          <p class="field-help">Le parole escluse non vengono proposte come nuove, ripassi o distrattori. Puoi reinserirle in qualsiasi momento.</p>
          <button class="btn secondary wide" data-action="toggle-excluded">${excludedManagerOpen ? 'Chiudi elenco' : 'Visualizza e gestisci'}</button>
          ${excludedManagerOpen ? renderExcludedVocabularyManager() : ''}
        </div>
      </details>
      ${renderTransferSettings()}
      <details class="settings-disclosure" data-settings-section="data" ${settingsOpenSection === 'data' ? 'open' : ''}>
        <summary><span><strong>Informazioni e dati</strong><small>Versione ${escapeHtml(KOTOBA_RELEASE.split('-')[0])} · Fonti e licenze</small></span><span class="disclosure-arrow" aria-hidden="true">⌄</span></summary>
        <div class="settings-disclosure-body">
          <p class="field-help"><strong>Versione app:</strong> ${escapeHtml(KOTOBA_RELEASE.split('-')[0])}<br><strong>Dizionario:</strong> Kotoba Lexicon V4.2 · ${EMBEDDED_VOCABULARY.meta.productionReadyCanonical.toLocaleString('it-IT')} accezioni canoniche (${EMBEDDED_VOCABULARY.meta.studyEnabledCanonical.toLocaleString('it-IT')} studiabili).<br><strong>Livelli:</strong> Essenziale, Base, Intermedio, Avanzato, Esperto. L'app è completamente offline e i dati restano in localStorage. <strong>HOLD:</strong> recuperi invariati rispetto alla 3.1.7.</p>
          <details class="kotoba-credits"><summary>Fonti e licenze del dizionario</summary>
      <p><strong>JMdict / EDRDG:</strong> grafie, letture e accezioni. © EDRDG e James W. Breen, CC BY-SA 4.0; dati selezionati e rielaborati per il progetto Kotoba Offline. Licenza: https://www.edrdg.org/edrdg/licence.html</p>
      <p><strong>FreeDict italiano–giapponese:</strong> dati storici di origine Wiktionary/DBnary, CC BY-SA 3.0. https://freedict.org/</p>
      <p><strong>Wiktionary giapponese e italiano:</strong> consultazione semantica e verifiche editoriali; testi del dizionario non riprodotti letteralmente nelle nuove schede. CC BY-SA 4.0. https://it.wiktionary.org/ · https://ja.wiktionary.org/</p>
      <p><strong>Japanese WordNet / NICT:</strong> © 2009–2010 NICT, secondo la licenza originale. <strong>WordNet italiano / MultiWordNet:</strong> Pianta, Bentivogli e Girardi, 2002, CC BY 3.0. Le condizioni complete sono conservate nei file di licenza dell'app.</p>
      <p><strong>Dati didattici JLPT:</strong> Jonathan Waller e progetto yomitan-jlpt-vocab, CC BY 4.0 / CC BY-SA 4.0; i livelli sono indicativi e non ufficiali. <strong>Esempi P01–P03:</strong> frasi didattiche redatte per Kotoba Offline, senza riproduzione di definizioni protette.</p>
      <p>Il dizionario viene aggiornato nelle nuove versioni dell'app e funziona senza connessione. Il corpus distribuito con questa versione incorpora 366 accezioni recuperate dagli HOLD. Per licenze e attribuzioni vedi anche il pacchetto di documentazione della versione 3.1.7.</p>
      </details>
          <button class="btn danger-outline" data-action="open-reset">Resetta progressi</button>
        </div>
      </details>
    </div>
  `, 'settings');
  if (captureMode) return;
  document.querySelectorAll('[data-settings-section]').forEach(el => el.addEventListener('toggle', () => {
    if (el.open) {
      settingsOpenSection = el.dataset.settingsSection;
      document.querySelectorAll('[data-settings-section]').forEach(other => {if (other !== el && other.open) other.open = false;});
    } else if (settingsOpenSection === el.dataset.settingsSection) settingsOpenSection = null;
  }));
  bindTransferSettings();
  document.querySelector('[data-settings-advanced]')?.addEventListener('toggle', e => {
    advancedDailyOpen = e.target.open;
  });
  document.querySelector('#daily-goal-minutes')?.addEventListener('change', e => {
    setting.dailyGoalMinutes = Math.max(1, Math.min(180, clampInt(e.target.value, 10)));
    saveState(state); mainViewContentCache.clear(); renderSettings();
  });
  const balanceSlider = document.querySelector('#daily-balance');
  balanceSlider?.addEventListener('input', e => {
    document.querySelector('#daily-balance-label').textContent = DAILY_BALANCE_LABELS[Number(e.target.value)] || DAILY_BALANCE_LABELS[2];
  });
  balanceSlider?.addEventListener('change', e => {
    setting.dailyBalance = Math.max(0, Math.min(4, Number(e.target.value)));
    saveState(state); mainViewContentCache.clear(); renderSettings();
  });
  document.querySelector('#daily-limit-enabled')?.addEventListener('change', e => {
    setting.dailyNewLimit = e.target.checked ? Math.max(0, clampInt(setting.newPerDay, 10)) : null;
    saveState(state); mainViewContentCache.clear(); advancedDailyOpen = true; renderSettings();
  });
  document.querySelector('#daily-limit-value')?.addEventListener('change', e => {
    setting.dailyNewLimit = Math.min(200, clampInt(e.target.value, 10));
    setting.newPerDay = setting.dailyNewLimit;
    saveState(state); mainViewContentCache.clear(); advancedDailyOpen = true; renderSettings();
  });
  document.querySelector('#study-level')?.addEventListener('change', e => {
    setting.studyLevel = normalizedStudyLevel(e.target.value);
    setting.jlptLevel = studyLevelToLegacyJlpt(setting.studyLevel);
    saveState(state); mainViewContentCache.clear(); renderSettings();
  });
  document.querySelector('[data-action="toggle-excluded"]')?.addEventListener('click', () => {
    excludedManagerOpen = !excludedManagerOpen;
    if (!excludedManagerOpen) { excludedSelection.clear(); excludedSearch = ''; }
    saveState(state); renderSettings();
  });
  document.querySelector('#excluded-search')?.addEventListener('input', e => {
    excludedSearch = e.target.value;
    renderSettings();
    const input = document.querySelector('#excluded-search');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  });
  document.querySelectorAll('[data-excluded-id]').forEach(el => el.addEventListener('change', e => {
    e.target.checked ? excludedSelection.add(e.target.dataset.excludedId) : excludedSelection.delete(e.target.dataset.excludedId);
    renderSettings();
  }));
  document.querySelectorAll('[data-restore-id]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation(); restoreExcludedIds([btn.dataset.restoreId]);
  }));
  document.querySelector('[data-action="excluded-select-all"]')?.addEventListener('click', () => {
    filteredExcludedEntries().forEach(v => excludedSelection.add(v.id)); renderSettings();
  });
  document.querySelector('[data-action="excluded-clear-selection"]')?.addEventListener('click', () => { excludedSelection.clear(); renderSettings(); });
  document.querySelector('[data-action="restore-selected"]')?.addEventListener('click', () => restoreExcludedIds([...excludedSelection]));
  document.querySelector('[data-action="open-reset"]')?.addEventListener('click', () => { resetDialogOpen = true; render(); });
}

function renderOnboarding() {
  const stats = computeStats(vocabulary, state);
  let body = '';
  if (onboardingStep === 1) {
    body = `<div class="onboarding-copy"><p class="eyebrow">1 DI 5</p><h1>Impara vocaboli giapponesi un po' alla volta</h1><p>L'app ti proporrà nuove parole e le farà tornare quando è il momento giusto per ripassarle.</p><button class="btn primary wide" data-action="onboarding-next">Continua</button></div>`;
  } else if (onboardingStep === 2) {
    body = `<div class="onboarding-copy"><p class="eyebrow">2 DI 5</p><h1>Come vuoi studiare ogni giorno?</h1>
      <label class="field-label" for="onboarding-minutes">Tempo della sessione quotidiana (minuti)</label>
      <input id="onboarding-minutes" class="hero-number" type="number" min="1" max="180" inputmode="numeric" value="${state.settings.dailyGoalMinutes}">
      <div class="setting-inline-heading"><label class="field-label" for="onboarding-balance">Bilanciamento</label><strong id="onboarding-balance-label">${DAILY_BALANCE_LABELS[dailyBalanceIndex(state.settings)]}</strong></div>
      <input id="onboarding-balance" class="study-range" type="range" min="0" max="4" step="1" value="${dailyBalanceIndex(state.settings)}">
      <div class="range-ends"><span>Solo ripasso</span><span>Solo nuove</span></div>
      <p class="field-help">Nella posizione equilibrata alterniamo nuove parole e ripassi. Potrai modificare entrambe le preferenze nelle Impostazioni.</p>
      <button class="btn primary wide" data-action="onboarding-next">Continua</button></div>`;
  } else if (onboardingStep === 3) {
    body = `<div class="onboarding-copy"><p class="eyebrow">3 DI 5</p><h1>Qual è il tuo livello di giapponese?</h1><p>Partiremo dal livello scelto e da quelli più facili, proponendo prima le parole più utili e frequenti in ogni livello. Gli argomenti restano bilanciati.</p><div class="jlpt-choice-grid">${STUDY_LEVELS.map(level => `<button class="jlpt-choice ${state.settings.studyLevel === level ? 'selected' : ''}" data-study-level="${level}"><strong>${studyLevelLabel(level)}</strong><span>${studyLevelReference(level)}</span></button>`).join('')}</div><p class="field-help">Il riferimento N5–N1 è orientativo e non implica che la parola compaia in una lista ufficiale del JLPT.</p><button class="btn primary wide" data-action="onboarding-next">Continua</button></div>`;
  } else if (onboardingStep === 4) {
    body = `<div class="onboarding-topics"><p class="eyebrow">4 DI 5</p><h1>Quali argomenti vuoi studiare?</h1><p>Puoi sceglierne più di uno. Li mescoleremo nella stessa sessione.</p>
      <div class="toolbar"><button class="text-btn" data-action="select-all">Seleziona tutti</button><button class="text-btn" data-action="deselect-all">Deseleziona tutti</button></div>
      <div class="onboarding-chip-grid">${TOPICS.map(t => `<button class="chip ${state.settings.selectedTopics.includes(t.id) ? 'selected' : ''}" data-topic="${t.id}">${t.label}</button>`).join('')}</div>
      <button class="btn primary wide sticky-cta" data-action="onboarding-next" ${state.settings.selectedTopics.length ? '' : 'disabled'}>Continua</button></div>`;
  } else {
    body = `<div class="onboarding-copy ready"><p class="eyebrow">5 DI 5</p><div class="ready-mark">準</div><h1>Pronto</h1><p>Ogni giorno: circa ${state.settings.dailyGoalMinutes} minuti · ${DAILY_BALANCE_LABELS[dailyBalanceIndex(state.settings)]}. Potrai cambiare queste preferenze quando vuoi.</p><p class="field-help">Livello di partenza: <strong>${studyLevelChoiceLabel(state.settings.studyLevel)}</strong></p><p class="field-help">Ora puoi avviare la tua prima sessione quando preferisci, dalla Home.</p><button class="btn primary wide" data-action="onboarding-start">Salva e torna alla Home</button></div>`;
  }
  shell(`<section class="onboarding"><button class="text-btn onboarding-exit" data-action="onboarding-exit" type="button">← Torna alla Home</button>${body}</section>`, 'onboarding');
  document.querySelector('#onboarding-balance')?.addEventListener('input', e => {
    document.querySelector('#onboarding-balance-label').textContent = DAILY_BALANCE_LABELS[Number(e.target.value)];
  });
  document.querySelector('#onboarding-minutes')?.addEventListener('change', e => {
    state.settings.dailyGoalMinutes = Math.max(1, Math.min(180, clampInt(e.target.value, 10))); saveState(state);
  });
  document.querySelector('#onboarding-balance')?.addEventListener('change', e => {
    state.settings.dailyBalance = Math.max(0, Math.min(4, Number(e.target.value))); saveState(state);
  });
  document.querySelectorAll('[data-study-level]').forEach(btn => btn.addEventListener('click', () => {
    state.settings.studyLevel = normalizedStudyLevel(btn.dataset.studyLevel);
    state.settings.jlptLevel = studyLevelToLegacyJlpt(state.settings.studyLevel);
    saveState(state); renderOnboarding();
  }));
  document.querySelector('[data-action="onboarding-next"]')?.addEventListener('click', () => {
    if (onboardingStep === 2) {
      state.settings.dailyGoalMinutes = Math.max(1, Math.min(180, clampInt(document.querySelector('#onboarding-minutes')?.value, 10)));
      state.settings.dailyBalance = Math.max(0, Math.min(4, Number(document.querySelector('#onboarding-balance')?.value ?? 2)));
    }
    onboardingStep = Math.min(5, onboardingStep + 1); saveState(state); render();
  });
  document.querySelectorAll('[data-topic]').forEach(btn => btn.addEventListener('click', () => {
    const set = new Set(state.settings.selectedTopics); const id = btn.dataset.topic;
    set.has(id) ? set.delete(id) : set.add(id); state.settings.selectedTopics = [...set]; saveState(state); renderOnboarding();
  }));
  document.querySelector('[data-action="select-all"]')?.addEventListener('click', () => { state.settings.selectedTopics = TOPICS.map(t => t.id); saveState(state); renderOnboarding(); });
  document.querySelector('[data-action="deselect-all"]')?.addEventListener('click', () => { state.settings.selectedTopics = []; saveState(state); renderOnboarding(); });
  document.querySelector('[data-action="onboarding-exit"]')?.addEventListener('click', () => { view = 'home'; render(); });
  document.querySelector('[data-action="onboarding-start"]')?.addEventListener('click', () => {
    state.onboardingComplete = true; saveState(state); view = 'home'; render();
  });
}


function addStudyIntervalByLocalDay(target, fromMs, toMs) {
  let cursor = Math.max(0, Number(fromMs || 0));
  const end = Math.max(cursor, Number(toMs || cursor));
  while (cursor < end) {
    const d = new Date(cursor);
    const key = localDateKey(d);
    const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0).getTime();
    const segmentEnd = Math.min(end, nextMidnight);
    target[key] = Math.max(0, Number(target[key] || 0)) + (segmentEnd - cursor) / 1000;
    cursor = segmentEnd;
  }
}

function totalRuntimeStudySeconds(rt = runtime) {
  return rt ? Object.values(rt.studySecondsByDate || {}).reduce((sum, value) => sum + Math.max(0, Number(value || 0)), 0) : 0;
}

function liveRuntimeSecondsForDate(rt, key, nowMs = Date.now()) {
  if (!rt) return 0;
  let seconds = Math.max(0, Number(rt.studySecondsByDate?.[key] || 0));
  if (rt.timingActive && rt.lastActiveTickAt) {
    const end = Math.min(nowMs, Number(rt.lastActiveTickAt) + MAX_UNCHECKPOINTED_MS);
    const temp = {};
    addStudyIntervalByLocalDay(temp, Number(rt.lastActiveTickAt), end);
    seconds += Math.max(0, Number(temp[key] || 0));
  }
  return seconds;
}

function checkpointAnswerTime(nowMs = Date.now()) {
  if (!runtime || !answerStartedAt || feedback) return;
  const item = runtime.items?.[runtime.index];
  if (item?.type !== 'question') return;
  runtime.currentQuestionElapsedMs = Math.max(0, Number(runtime.currentQuestionElapsedMs || 0)) + Math.max(0, nowMs - answerStartedAt);
  answerStartedAt = null;
}

function checkpointStudyTime(nowMs = Date.now()) {
  if (!runtime || !runtime.timingActive || !runtime.lastActiveTickAt) return;
  const from = Number(runtime.lastActiveTickAt);
  const to = Math.min(nowMs, from + MAX_UNCHECKPOINTED_MS);
  if (to > from) addStudyIntervalByLocalDay(runtime.studySecondsByDate, from, to);
  runtime.lastActiveTickAt = nowMs;
}

function serializeActiveSession() {
  if (!runtime || runtime.finishedSummary) return null;
  return {
    ...runtime,
    newSeen: [...(runtime.newSeen instanceof Set ? runtime.newSeen : new Set(runtime.newSeen || []))],
    timingActive: false,
    lastActiveTickAt: null,
    feedback: feedback ? { ...feedback } : null,
    selectedOption: selectedOption == null ? null : selectedOption,
    currentQuestionElapsedMs: Math.max(0, Number(runtime.currentQuestionElapsedMs || 0))
  };
}

function persistActiveSession(checkpoint = false) {
  if (!runtime || runtime.finishedSummary) return;
  if (checkpoint) {
    const nowMs = Date.now();
    checkpointStudyTime(nowMs);
    checkpointAnswerTime(nowMs);
  }
  state.activeSession = serializeActiveSession();
  saveState(state);
}

function startSessionCheckpointing() {
  if (sessionCheckpointTimer) clearInterval(sessionCheckpointTimer);
  sessionCheckpointTimer = setInterval(() => {
    if (!runtime || view !== 'session' || document.visibilityState === 'hidden') return;
    const nowMs = Date.now();
    checkpointStudyTime(nowMs);
    checkpointAnswerTime(nowMs);
    runtime.timingActive = true;
    runtime.lastActiveTickAt = nowMs;
    if (!feedback && runtime.items?.[runtime.index]?.type === 'question') answerStartedAt = nowMs;
    state.activeSession = serializeActiveSession();
    saveState(state);
  }, SESSION_CHECKPOINT_MS);
}

function pauseSessionTimingForBackground() {
  if (!runtime || view !== 'session') return;
  const nowMs = Date.now();
  checkpointStudyTime(nowMs);
  checkpointAnswerTime(nowMs);
  runtime.timingActive = false;
  runtime.lastActiveTickAt = null;
  state.activeSession = serializeActiveSession();
  saveState(state);
}

function resumeSessionTimingIfVisible() {
  if (!runtime || view !== 'session' || document.visibilityState === 'hidden') return;
  const nowMs = Date.now();
  runtime.timingActive = true;
  runtime.lastActiveTickAt = nowMs;
  if (!feedback && runtime.items?.[runtime.index]?.type === 'question') answerStartedAt = nowMs;
}

function pauseCurrentSession() {
  if (!runtime) return;
  const nowMs = Date.now();
  checkpointStudyTime(nowMs);
  checkpointAnswerTime(nowMs);
  runtime.timingActive = false;
  runtime.lastActiveTickAt = null;
  state.activeSession = serializeActiveSession();
  saveState(state);
  runtime = null;
  feedback = null;
  selectedOption = null;
  answerStartedAt = null;
  view = 'home';
  render();
}

function resumeSavedSession() {
  const saved = state.activeSession;
  if (!saved || !Array.isArray(saved.items) || !saved.items.length) return;
  runtime = {
    ...saved,
    newSeen: new Set(saved.newSeen || []),
    studySecondsByDate: { ...(saved.studySecondsByDate || {}) },
    timingActive: true,
    lastActiveTickAt: Date.now(),
    finishedSummary: null
  };
  feedback = saved.feedback ? { ...saved.feedback } : null;
  selectedOption = saved.selectedOption == null ? null : saved.selectedOption;
  learnDecisionMode = null;
  answerStartedAt = !feedback && runtime.items?.[runtime.index]?.type === 'question' ? Date.now() : null;
  view = 'session';
  adaptRemainingSessionExerciseTypes();
  rebuildRemainingMultipleChoiceOptions();
  startSessionCheckpointing();
  renderSession();
}

function startSession(mode = 'daily') {
  if (state.activeSession) return resumeSavedSession();
  const now = new Date();
  const plan = mode === 'free' ? buildFreeSession(vocabulary, state, now)
    : mode === 'extra-new' ? buildExtraNewSession(vocabulary, state, now)
    : mode === 'extra-active' ? buildExtraActiveSession(vocabulary, state, now)
    : buildDailySession(vocabulary, state, now);
  runtime = {
    ...plan,
    mode,
    index: 0,
    startedAt: now.toISOString(),
    dailyDateKey: mode === 'daily' ? localDateKey(now) : null,
    dailyGoalSeconds: dailyGoalSeconds(state),
    counts: { correct: 0, almost: 0, wrong: 0 },
    answers: 0,
    levelsUp: 0,
    newSeen: new Set(),
    finishedSummary: null,
    studySecondsByDate: {},
    currentQuestionElapsedMs: 0,
    timingActive: true,
    lastActiveTickAt: Date.now()
  };
  feedback = null;
  selectedOption = null;
  learnDecisionMode = null;
  answerStartedAt = runtime.items?.[0]?.type === 'question' ? Date.now() : null;
  if (!runtime.items.length) { runtime = null; view = 'home'; render(); return; }
  state.activeSession = serializeActiveSession();
  saveState(state);
  view = 'session';
  startSessionCheckpointing();
  renderSession();
}

function sessionElapsedSeconds() {
  if (!runtime) return 0;
  let total = totalRuntimeStudySeconds(runtime);
  if (runtime.timingActive && runtime.lastActiveTickAt) {
    total += Math.max(0, Math.min(Date.now() - Number(runtime.lastActiveTickAt), MAX_UNCHECKPOINTED_MS)) / 1000;
  }
  return total;
}

function questionPosition() {
  const questions = runtime.items.filter(i => i.type === 'question');
  const currentItem = runtime.items[runtime.index];
  if (currentItem?.type !== 'question') return { current: Math.max(0, runtime.items.slice(0, runtime.index).filter(i => i.type === 'question').length), total: questions.length };
  return { current: runtime.items.slice(0, runtime.index + 1).filter(i => i.type === 'question').length, total: questions.length };
}

function rebuildRemainingMultipleChoiceOptions() {
  if (!runtime) return;
  for (let i = Math.max(0, runtime.index); i < runtime.items.length; i++) {
    const item = runtime.items[i];
    if (item?.type !== 'question' || item.exerciseType !== 'mc') continue;
    const target = byId(item.vocabularyId);
    if (!target || target.studyEnabled === false || isVocabularyExcluded(state, target.id)) continue;
    item.options = buildOptions(vocabulary, target, item.direction, `${runtime.seed || 'session'}:rebuild:${i}`, item.italianPrompt);
  }
}

function retuneSelfAssessedQuestions(vocab, level) {
  if (!runtime) return;
  const currentIndex = runtime.index;
  // Remove only the current learning card. Keep the already planned questions
  // so "La so già" still exercises the word at the selected difficulty.
  runtime.items.splice(currentIndex, 1);
  let ordinal = 0;
  for (let i = currentIndex; i < runtime.items.length; i++) {
    const item = runtime.items[i];
    if (item?.type !== 'question' || item.vocabularyId !== vocab.id) continue;
    const type = exerciseTypeForLevel(level, ordinal++, `${runtime.seed || 'session'}:self-assessed:${vocab.id}`);
    item.exerciseType = type;
    item.options = type === 'mc'
      ? buildOptions(vocabulary, vocab, item.direction, `${runtime.seed || 'session'}:self-assessed-options:${vocab.id}:${i}`, item.italianPrompt)
      : null;
  }
  runtime.currentQuestionElapsedMs = 0;
  feedback = null;
  selectedOption = null;
  answerStartedAt = runtime.items?.[runtime.index]?.type === 'question' ? Date.now() : null;
}

function adaptRemainingSessionExerciseTypes() {
  if (!runtime) return;
  const mixedOrdinals = new Map();
  for (let i = Math.max(0, runtime.index); i < runtime.items.length; i++) {
    const item = runtime.items[i];
    if (item?.type !== 'question') continue;
    const vocab = byId(item.vocabularyId);
    if (!vocab || vocab.studyEnabled === false || isVocabularyExcluded(state, vocab.id)) continue;
    const progress = state?.progress?.[item.vocabularyId]?.[item.direction] || defaultDirectionProgress();
    const level = levelFromProgress(progress);
    const stage = adaptiveExerciseStageForLevel(level);
    let type;
    if (stage === 'mixed') {
      const key = `${item.vocabularyId}:${item.direction}`;
      const ordinal = mixedOrdinals.get(key) || 0;
      mixedOrdinals.set(key, ordinal + 1);
      type = exerciseTypeForLevel(level, ordinal, `${runtime.seed || 'session'}:resume:${key}`);
    } else {
      type = stage;
    }
    item.exerciseType = type;
    item.options = type === 'mc'
      ? buildOptions(vocabulary, vocab, item.direction, `${runtime.seed || 'session'}:adaptive-rebuild:${i}`, item.italianPrompt)
      : null;
  }
}

function removeVocabularyFromRemainingSession(vocabularyId) {
  if (!runtime) return;
  const currentIndex = runtime.index;
  runtime.items = runtime.items.filter((item, idx) => idx < currentIndex || item.vocabularyId !== vocabularyId);
  runtime.currentQuestionElapsedMs = 0;
  feedback = null;
  selectedOption = null;
  answerStartedAt = runtime.items?.[runtime.index]?.type === 'question' ? Date.now() : null;
}

function markLearnedBySelfAssessment(vocab, level) {
  const now = new Date();
  const assessed = applySelfAssessment(state, vocab.id, level, now, runtime?.mode === 'daily');
  if (runtime?.mode === 'daily' && assessed) assessed.introducedDailyDayKey = runtime.dailyDateKey || localDateKey(now);
  runtime.newSeen.add(vocab.id);
  retuneSelfAssessedQuestions(vocab, level);
  learnDecisionMode = null;
  persistActiveSession();
  renderSession();
}

function chooseReplacementNewVocabulary(excludedVocab) {
  if (!runtime) return null;
  const selectedTopics = state.settings.selectedTopics || [];
  if (!selectedTopics.length) return null;

  // Never reuse a vocabulary that already appears anywhere in this session,
  // including words introduced earlier or already scheduled later.
  const usedIds = new Set(runtime.items.map(item => item?.vocabularyId).filter(Boolean));
  for (const id of runtime.newSeen || []) usedIds.add(id);
  usedIds.add(excludedVocab.id);
  const usedEntryKeys = new Set([...usedIds].map(id => byId(id)).filter(Boolean).map(entryGroupKey));

  const available = eligibleNewWordsByStudyLevel(vocabulary, state, selectedTopics).words
    .filter(candidate => !usedIds.has(candidate.id) && !usedEntryKeys.has(entryGroupKey(candidate)));
  if (!available.length) return null;

  // Prefer the same selected topic(s) as the excluded word. This keeps the
  // session's topic balance stable. Fall back to any selected topic only when
  // no same-topic replacement exists.
  const preferredTopics = (excludedVocab.topics || []).filter(topic => selectedTopics.includes(topic));
  const sameTopic = preferredTopics.length
    ? available.filter(candidate => candidateTargetTopics(candidate).some(topic => preferredTopics.includes(topic)))
    : [];
  const pool = sameTopic.length ? sameTopic : available;
  const counter = Math.max(0, Number(runtime.replacementCounter || 0));
  return prioritizeNewVocabulary(pool, `${runtime.seed || 'session'}:replacement:${excludedVocab.id}:${counter}`)[0] || null;
}

function insertReplacementNewVocabulary(excludedVocab) {
  if (!runtime) return null;
  const replacement = chooseReplacementNewVocabulary(excludedVocab);
  if (!replacement) return null;

  runtime.replacementCounter = Math.max(0, Number(runtime.replacementCounter || 0)) + 1;
  const insertAt = Math.max(0, Math.min(runtime.index, runtime.items.length));
  const questionNumber = runtime.items.slice(0, insertAt).filter(item => item.type === 'question').length;
  const replacementSeed = `${runtime.seed || 'session'}:replacement:${runtime.replacementCounter}:${replacement.id}`;
  const firstDirection = (hashString(replacementSeed) + questionNumber) % 2 === 0 ? 'itToJp' : 'jpToIt';
  const secondDirection = firstDirection === 'itToJp' ? 'jpToIt' : 'itToJp';
  const firstType = exerciseTypeForVocabulary(state, replacement.id, firstDirection, questionNumber, replacementSeed);
  const source = runtime.mode === 'extra-new' ? 'extra-new' : 'new';

  const learnItem = { type: 'learn', vocabularyId: replacement.id, source, replacementFor: excludedVocab.id, learningKind: learningKindForVocabulary(replacement, state, vocabulary), targetVocabularyId: replacement._senseTargetId || replacement.id, targetTopics: candidateTargetTopics(replacement), forcedPrerequisite: Boolean(replacement._senseForcedPrerequisite) };
  const firstQuestion = questionItem(
    replacement,
    firstDirection,
    firstType,
    vocabulary,
    `${replacementSeed}:first`,
    source,
    true
  );
  firstQuestion.replacementFor = excludedVocab.id;
  runtime.items.splice(insertAt, 0, learnItem, firstQuestion);

  // Add the reverse direction only if it can respect the same spacing rule as
  // every other word. Otherwise SRS will schedule it later rather than making
  // the exercise artificially easy.
  const secondType = exerciseTypeForVocabulary(state, replacement.id, secondDirection, questionNumber + 1, replacementSeed);
  const secondQuestion = questionItem(
    replacement,
    secondDirection,
    secondType,
    vocabulary,
    `${replacementSeed}:second`,
    source,
    true
  );
  secondQuestion.replacementFor = excludedVocab.id;
  const secondInsertAt = safeRetryInsertionIndex(runtime.items, insertAt + 1, replacement.id);
  const freeHasCapacity = runtime.mode !== 'free' || runtime.items.filter(item => item.type === 'question').length < runtime.plannedExercises;
  if (secondInsertAt >= 0 && freeHasCapacity) runtime.items.splice(secondInsertAt, 0, secondQuestion);

  return replacement;
}

function excludeCurrentVocabulary(vocab) {
  const currentItem = runtime?.items?.[runtime.index];
  const shouldReplace = currentItem?.type === 'learn' && (currentItem.source === 'new' || currentItem.source === 'extra-new');
  excludeVocabularyFromStudy(state, vocab.id, new Date());
  removeVocabularyFromRemainingSession(vocab.id);
  const replacement = shouldReplace ? insertReplacementNewVocabulary(vocab) : null;
  rebuildRemainingMultipleChoiceOptions();
  learnDecisionMode = null;
  persistActiveSession();
  saveState(state);
  renderSession();
  return replacement;
}

function renderSession() {
  if (!runtime || runtime.index >= runtime.items.length) return finishSession();
  const item = runtime.items[runtime.index];
  const vocab = byId(item.vocabularyId);
  if (!vocab) { runtime.index++; return renderSession(); }
  const pos = questionPosition();
  const todayKey = localDateKey();
  const todayStudySeconds = completedStudySecondsForDate(state, todayKey) + liveRuntimeSecondsForDate(runtime, todayKey);
  const goalSeconds = runtime.dailyGoalSeconds || dailyGoalSeconds(state);
  const goalPct = Math.min(100, Math.round(todayStudySeconds / goalSeconds * 100));

  let content = '';
  if (item.type === 'learn') {
    const learningKind = item.learningKind || learningKindForVocabulary(vocab, state, vocabulary);
    const isNewSense = learningKind === 'sense';
    const levelPicker = learnDecisionMode === 'known' ? `<div class="level-picker">
      <p class="level-picker-title">${isNewSense ? 'Quanto bene conosci già questa accezione?' : 'Quanto bene conosci già questa parola?'}</p>
      <p class="field-help">Il livello scelto verrà usato come punto di partenza per entrambe le direzioni di studio.</p>
      <div class="level-option-grid">${SELF_ASSESSMENT_LEVELS.map(level => `<button class="level-option" data-self-level="${escapeHtml(level)}"><strong>${escapeHtml(level)}</strong><span>${level === 'In apprendimento' ? 'Scelta multipla' : level === 'In consolidamento' ? 'Esercizi misti' : level === 'Quasi appreso' ? 'Esercizi misti' : level === 'Appreso' ? 'Risposta libera' : 'Risposta libera · molto solido'}</span></button>`).join('')}</div>
      <button class="text-btn level-cancel" data-action="learn-known-cancel">Annulla</button>
    </div>` : '';
    const prerequisiteNote = item.forcedPrerequisite
      ? `<p class="field-help">Prerequisito per un significato di ${escapeHtml((item.targetTopics || []).map(topicLabel).join(' · ') || 'un argomento selezionato')}</p>`
      : '';
    content = `<section class="study-card learn-card">
      <p class="eyebrow">${isNewSense ? 'NUOVA ACCEZIONE' : 'NUOVO VOCABOLO'}</p>
      ${prerequisiteNote}
      <div class="jp-hero">${vocab.japanese}</div>
      ${containsKanji(vocab.japanese) ? `<div class="kana">${escapeHtml(displayReading(vocab))}</div>` : (vocab.kana ? `<div class="kana">${escapeHtml(displayReading(vocab))}</div>` : '')}
      <div class="meaning">${escapeHtml(vocab.italian.join(' · '))}</div>
      <div class="learn-meta-row"><span class="jlpt-badge">${escapeHtml(`${studyLevelLabel(vocab.studyLevel)} · ${studyLevelReference(vocab.studyLevel)}`)}</span><span>${escapeHtml(topicLabel(vocab.topics.find(t => state.settings.selectedTopics.includes(t)) || vocab.topics.find(t => t !== 'freedict_completo') || vocab.topics[0]))}</span>${usageRegisterBadgeHtml(vocab)}</div>
      ${vocab.senseLabelItalian || vocab.senseNoteItalian ? `<div class="sense-box">${vocab.senseLabelItalian ? `<p class="sense-label">${escapeHtml(vocab.senseLabelItalian)}</p>` : ''}${vocab.senseNoteItalian ? `<p class="sense-note">${escapeHtml(vocab.senseNoteItalian)}</p>` : ''}</div>` : ''}
      ${usageRegisterNoteHtml(vocab)}
      ${vocab.exampleJapanese && vocab.exampleItalian ? `<div class="kotoba-example" aria-label="Frase di esempio"><p class="kotoba-example-jp" lang="ja">${escapeHtml(vocab.exampleJapanese)}</p><p class="kotoba-example-it">${escapeHtml(vocab.exampleItalian)}</p></div>` : ''}
      ${learnDecisionMode === 'known' ? levelPicker : `<div class="learn-actions">
        <button class="btn primary wide" data-action="learn-continue">Continua</button>
        <button class="btn secondary wide" data-action="learn-known">La so già</button>
        <button class="exclude-word-btn" data-action="learn-exclude">Non voglio studiarla</button>
      </div>`}
    </section>`;
  } else if (feedback) {
    const icon = feedback.result === 'correct' ? '✓' : feedback.result === 'almost' ? '~' : '✕';
    const label = feedback.result === 'correct' ? 'Corretto' : feedback.result === 'almost' ? 'Quasi corretto' : 'Sbagliato';
    const kanaAnswer = item.direction === 'itToJp' && normalizeJapanese(feedback.answer) === normalizeJapanese(vocab.kana) && normalizeJapanese(vocab.kana) !== normalizeJapanese(vocab.japanese);
    const directItalian = new Set([...(vocab.italian || []), ...(vocab.alternativeItalian || [])].map(normalizeItalian));
    const extraItalianAccepted = item.direction === 'jpToIt'
      ? acceptedAnswers(vocab, 'jpToIt').filter(x => !directItalian.has(normalizeItalian(x)))
      : [];
    const extraItalianLabel = extraItalianAccepted.length
      ? `${extraItalianAccepted.slice(0, 6).join(' · ')}${extraItalianAccepted.length > 6 ? ` · +${extraItalianAccepted.length - 6}` : ''}`
      : '';
    content = `<section class="study-card feedback-card ${feedback.result}">
      <div class="feedback-title"><span>${icon}</span>${label}</div>
      ${kanaAnswer ? `<p class="your-answer">✓ ${escapeHtml(feedback.answer)}</p>` : ''}
      ${feedback.result !== 'correct' ? `<p class="correct-answer-label">Risposta corretta</p>` : ''}
      <div class="jp-feedback">${vocab.japanese}</div>
      ${vocab.kana ? `<div class="kana">${escapeHtml(displayReading(vocab))}</div>` : ''}
      <div class="meaning">${escapeHtml(vocab.italian.join(' · '))}</div>
      ${usageRegisterFeedbackHtml(vocab)}
      ${extraItalianLabel ? `<p class="field-help">Altre traduzioni accettate per questa forma: ${escapeHtml(extraItalianLabel)}</p>` : ''}
      <button class="btn primary wide" data-action="question-continue">Continua</button>
    </section>`;
  } else {
    const isItToJp = item.direction === 'itToJp';
    const prompt = isItToJp ? 'Come si dice in giapponese?' : 'Cosa significa in italiano?';
    const term = isItToJp ? String(item.italianPrompt || vocab.italian[0] || '').toLocaleUpperCase('it-IT') : vocab.japanese;
    const answerArea = item.exerciseType === 'free'
      ? `<form id="answer-form"><input id="answer-input" class="answer-input ${isItToJp ? 'jp-input' : ''}" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="${isItToJp ? 'Kanji, kana o romaji...' : 'Scrivi la risposta...'}" aria-label="Risposta"><button class="btn primary wide" type="submit">Conferma</button><button class="btn secondary wide" type="button" data-action="dont-know">Non lo so</button></form>`
      : `<div class="options" role="group" aria-label="Scegli una risposta">${item.options.map((o, idx) => `<button class="option ${selectedOption === o ? 'selected' : ''}" data-option="${idx}">${isItToJp ? renderJapaneseExerciseOption(o, vocab) : escapeHtml(o)}</button>`).join('')}</div><button class="btn primary wide" data-action="confirm-option" ${selectedOption == null ? 'disabled' : ''}>Conferma</button><button class="btn secondary wide" type="button" data-action="dont-know">Non lo so</button>`;
    const promptReading = !isItToJp ? displayReading(vocab) : '';
    const showPromptReading = promptReading && normalizeJapanese(promptReading) !== normalizeJapanese(vocab.japanese);
    content = `<section class="study-card question-card">
      <p class="question-prompt">${prompt}</p>
      <div class="question-term ${isItToJp ? '' : 'jp-question'}">${escapeHtml(term)}</div>
      ${showPromptReading ? `<div class="question-reading">${escapeHtml(promptReading)}</div>` : ''}
      ${answerArea}
    </section>`;
  }

  shell(`
    <header class="session-header">
      <div><div><strong>${pos.current} / ${pos.total}</strong><span>Oggi ${formatMinutes(todayStudySeconds)} / ${formatMinutes(goalSeconds)} min${goalPct >= 100 ? ' · obiettivo raggiunto' : ''}</span></div><div class="session-header-actions"><button class="session-pause" data-action="pause-session" type="button">Pausa</button>${runtime.mode === 'daily' ? '' : '<button class="session-stop" data-action="finish-free-early" type="button">Concludi</button>'}</div></div>
      <div class="session-progress"><i style="width:${pos.total ? Math.min(100, pos.current / pos.total * 100) : 0}%"></i></div>
    </header>
    ${content}
    ${freeFinishDialogHtml()}
  `, 'session');

  document.querySelector('[data-action="pause-session"]')?.addEventListener('click', pauseCurrentSession);
  document.querySelector('[data-action="finish-free-early"]')?.addEventListener('click', () => {
    freeFinishDialogOpen = true;
    persistActiveSession(true);
    renderSession();
  });
  document.querySelector('[data-action="cancel-free-finish"]')?.addEventListener('click', () => {
    freeFinishDialogOpen = false;
    renderSession();
  });
  document.querySelector('[data-action="confirm-free-finish"]')?.addEventListener('click', () => {
    freeFinishDialogOpen = false;
    finishSession(true);
  });

  if (item.type === 'learn') {
    document.querySelector('[data-action="learn-continue"]')?.addEventListener('click', () => {
      const nowDate = new Date();
      const now = nowDate.toISOString();
      const vp = ensureVocabularyProgress(state, vocab.id, now);
      if (!vp.introducedDayKey) vp.introducedDayKey = runtime?.mode === 'daily' && runtime.dailyDateKey
        ? runtime.dailyDateKey
        : localDateKey(nowDate);
      if (runtime?.mode === 'daily') vp.introducedDailyDayKey = runtime.dailyDateKey || localDateKey(nowDate);
      runtime.newSeen.add(vocab.id);
      learnDecisionMode = null;
      runtime.index++;
      runtime.currentQuestionElapsedMs = 0;
      answerStartedAt = runtime.items?.[runtime.index]?.type === 'question' ? Date.now() : null;
      persistActiveSession();
      renderSession();
    });
    document.querySelector('[data-action="learn-known"]')?.addEventListener('click', () => {
      learnDecisionMode = 'known';
      renderSession();
    });
    document.querySelector('[data-action="learn-known-cancel"]')?.addEventListener('click', () => {
      learnDecisionMode = null;
      renderSession();
    });
    document.querySelectorAll('[data-self-level]').forEach(btn => btn.addEventListener('click', () => {
      markLearnedBySelfAssessment(vocab, btn.dataset.selfLevel);
    }));
    document.querySelector('[data-action="learn-exclude"]')?.addEventListener('click', () => excludeCurrentVocabulary(vocab));
    return;
  }

  if (feedback) {
    document.querySelector('[data-action="question-continue"]').addEventListener('click', () => {
      feedback = null; selectedOption = null; runtime.index++; runtime.currentQuestionElapsedMs = 0;
      answerStartedAt = runtime.items?.[runtime.index]?.type === 'question' ? Date.now() : null;
      persistActiveSession();
      renderSession();
    });
    return;
  }

  document.querySelector('#answer-form')?.addEventListener('submit', e => {
    e.preventDefault();
    submitAnswer(document.querySelector('#answer-input').value);
  });
  const input = document.querySelector('#answer-input');
  if (input && window.matchMedia('(pointer: fine)').matches) setTimeout(() => { if (input.isConnected) input.focus(); }, 0);
  document.querySelectorAll('[data-option]').forEach(btn => btn.addEventListener('click', () => {
    selectedOption = item.options[Number(btn.dataset.option)];
    persistActiveSession();
    renderSession();
  }));
  document.querySelector('[data-action="confirm-option"]')?.addEventListener('click', () => {
    if (selectedOption != null) submitAnswer(selectedOption);
  });
  document.querySelector('[data-action="dont-know"]')?.addEventListener('click', () => {
    submitAnswer('', 'wrong', true);
  });
}

function submitAnswer(answer, forcedResult = null, gaveUp = false) {
  const item = runtime.items[runtime.index];
  const vocab = byId(item.vocabularyId);
  const nowMs = Date.now();
  checkpointStudyTime(nowMs);
  checkpointAnswerTime(nowMs);
  runtime.timingActive = true;
  runtime.lastActiveTickAt = nowMs;
  const now = new Date(nowMs);
  const checked = forcedResult
    ? { result: forcedResult, candidates: acceptedAnswers(vocab, item.direction) }
    : validateAnswer(vocab, item.direction, answer, item.italianPrompt, item.exerciseType === 'free');
  const vp = ensureVocabularyProgress(state, vocab.id, now.toISOString());
  const updated = updateDirectionProgress(vp[item.direction], {
    result: checked.result,
    exerciseType: item.exerciseType,
    now,
    affectsDailySchedule: runtime?.mode === 'daily'
  });
  vp[item.direction] = updated.progress;
  refreshSensePriorityUnlock(state, vocab.id, now);

  const record = {
    vocabularyId: vocab.id,
    transferId: (typeof crypto!=='undefined'&&crypto.randomUUID) ? crypto.randomUUID() : 'q-'+new Date().getTime()+'-'+Math.random().toString(36).slice(2),
    direction: item.direction,
    exerciseType: item.exerciseType,
    answer: String(answer),
    result: checked.result,
    gaveUp: Boolean(gaveUp),
    sessionMode: runtime?.mode || 'daily',
    source: item.source || null,
    timestamp: now.toISOString(),
    timeSpentMs: Math.max(0, Number(runtime.currentQuestionElapsedMs || 0))
  };
  runtime.currentQuestionElapsedMs = 0;
  answerStartedAt = null;
  state.answers.push(record);
  runtime.counts[checked.result] += 1;
  runtime.answers += 1;
  if (updated.levelIncreased) runtime.levelsUp += 1;

  const freeQuestionCapacity = runtime.mode === 'free'
    ? Math.max(1, Number(runtime.plannedExercises || 20)) : Infinity;
  const mayAddRetry = runtime.items.filter(item => item.type === 'question').length < freeQuestionCapacity;
  if (checked.result === 'wrong' && item.retryCount < 2 && mayAddRetry) {
    const retryCount = item.retryCount + 1;
    const retryType = exerciseTypeForLevel(updated.afterLevel, retryCount, `${runtime.seed || 'session'}:retry:${item.vocabularyId}:${item.direction}:${retryCount}`);
    const retry = {
      ...item,
      source: 'retry',
      retryCount,
      exerciseType: retryType,
      options: retryType === 'mc'
        ? buildOptions(vocabulary, vocab, item.direction, `${runtime.seed || 'session'}:retry-options:${item.vocabularyId}:${item.direction}:${retryCount}`, item.italianPrompt)
        : null
    };
    const insertAt = safeRetryInsertionIndex(runtime.items, runtime.index, item.vocabularyId);
    if (insertAt >= 0) runtime.items.splice(insertAt, 0, retry);
  }

  feedback = { result: checked.result, answer: String(answer) };
  persistActiveSession();
  renderSession();
}

function finishSession(endedEarly = false) {
  if (endedEarly && runtime?.mode === 'daily') return;
  if (!runtime || runtime.finishedSummary) return;
  const finishMs = Date.now();
  checkpointStudyTime(finishMs);
  checkpointAnswerTime(finishMs);
  runtime.timingActive = false;
  runtime.lastActiveTickAt = null;
  const completedAt = new Date(finishMs);
  const durationSeconds = Math.max(1, Math.round(totalRuntimeStudySeconds(runtime)));
  const accuracy = runtime.answers ? Math.round(runtime.counts.correct / runtime.answers * 100) : 0;
  const summary = {
    durationSeconds,
    answers: runtime.answers,
    correct: runtime.counts.correct,
    almost: runtime.counts.almost,
    wrong: runtime.counts.wrong,
    newCount: runtime.newSeen.size,
    levelsUp: runtime.levelsUp,
    accuracy,
    endedEarly: Boolean(endedEarly),
    plannedExercises: runtime.mode === 'free' ? runtime.plannedExercises : null
  };
  runtime.finishedSummary = summary;
  state.sessions.push({
    startedAt: runtime.startedAt,
    completedAt: completedAt.toISOString(),
    mode: runtime.mode || 'daily',
    ...(runtime.mode === 'daily' && runtime.dailyDateKey ? { dailyDateKey: runtime.dailyDateKey } : {}),
    studySecondsByDate: { ...(runtime.studySecondsByDate || {}) },
    ...summary
  });
  state.activeSession = null;
  saveState(state);
  view = 'session-complete';
  renderSessionComplete();
}

function renderSessionComplete() {
  const s = runtime?.finishedSummary;
  if (!s) { view = 'home'; return render(); }
  const mode = runtime?.mode || 'daily';
  const isDaily = mode === 'daily';
  const modeLabel = mode === 'free' ? 'Studio libero' : mode === 'extra-new' ? 'Nuove parole' : mode === 'extra-active' ? 'Ripasso extra' : 'Sessione quotidiana';
  const activeCount = activeVocabularyIds(state).length;
  const goal = dailyGoalProgress(state);
  const unseenSelected = eligibleNewWordsByStudyLevel(vocabulary, state, state.settings.selectedTopics || []).words.length;
  shell(`
    <section class="completion">
      <div class="completion-mark">完</div>
      <span class="mode-badge">${modeLabel}</span>
      <h1>${s.endedEarly ? 'Sessione conclusa' : isDaily ? 'Sessione completata' : 'Allenamento completato'} <span aria-hidden="true">${s.endedEarly ? '✓' : '🎉'}</span></h1>${s.endedEarly ? '<p class="field-help">Progressi salvati. Gli esercizi non svolti non sono stati conteggiati come errori.</p>' : ''}
      <p class="completion-time">${formatMinutes(s.durationSeconds)} min</p>
      <p class="field-help">Studio di oggi: ${formatMinutes(goal.studiedSeconds)} / ${formatMinutes(goal.goalSeconds)} min${goal.reached ? ' · obiettivo raggiunto ✓' : ''}</p>
      <div class="summary-list">
        <div><span>Risposte</span><strong>${s.answers}</strong></div>
        <div><span>Corrette</span><strong>${s.correct}</strong></div>
        <div><span>Quasi corrette</span><strong>${s.almost}</strong></div>
        <div><span>Sbagliate</span><strong>${s.wrong}</strong></div>
        <div><span>Nuovi vocaboli studiati</span><strong>${s.newCount}</strong></div>
        <div><span>Passaggi di livello</span><strong>${s.levelsUp}</strong></div>
        <div class="summary-accuracy"><span>Accuratezza</span><strong>${s.accuracy}%</strong></div>
      </div>
      <div class="continue-box">
        <h2>Continua a studiare</h2>
        <p>Personalizza un'altra sessione libera o torna alla Home. I ripassi della sessione quotidiana non vengono anticipati dallo studio libero.</p>
        <button class="btn secondary wide" data-action="open-free">Personalizza studio libero</button>
      </div>

      <button class="btn primary wide" style="margin-top:10px" data-action="finish-session">Torna alla Home</button>
    </section>
  `, 'session-complete');
  document.querySelector('[data-action="finish-session"]').addEventListener('click', () => { runtime = null; state.activeSession = null; saveState(state); view = 'home'; render(); });
  document.querySelector('[data-action="open-free"]')?.addEventListener('click', openFreeConfig);
}


/* Kana practice --------------------------------------------------------- */
const KANA_STORAGE_KEY = 'kotoba-kana-practice-v1';
const KANA_CATEGORIES = [
  { id:'primary', label:'Primari', note:'Gojūon moderno' },
  { id:'voiced', label:'Nigorizzati', note:'Dakuten e handakuten' },
  { id:'yoon', label:'Composti', note:'Yōon con ゃ・ゅ・ょ' },
  { id:'extended', label:'Combinazioni estese', note:'Suoni usati soprattutto nei prestiti' }
];

function kanaItem(id, category, row, hira, kata, romaji, accepted = []) {
  return { id, category, row, hira, kata, romaji, accepted: Array.from(new Set([romaji, ...accepted].map(x => String(x).toLowerCase()))) };
}

const KANA_ITEMS = [
  ...[
    ['a','Vocali','あ','ア','a'],['i','Vocali','い','イ','i'],['u','Vocali','う','ウ','u'],['e','Vocali','え','エ','e'],['o','Vocali','お','オ','o'],
    ['ka','K','か','カ','ka'],['ki','K','き','キ','ki'],['ku','K','く','ク','ku'],['ke','K','け','ケ','ke'],['ko','K','こ','コ','ko'],
    ['sa','S','さ','サ','sa'],['shi','S','し','シ','shi',['si']],['su','S','す','ス','su'],['se','S','せ','セ','se'],['so','S','そ','ソ','so'],
    ['ta','T','た','タ','ta'],['chi','T','ち','チ','chi',['ti']],['tsu','T','つ','ツ','tsu',['tu']],['te','T','て','テ','te'],['to','T','と','ト','to'],
    ['na','N','な','ナ','na'],['ni','N','に','ニ','ni'],['nu','N','ぬ','ヌ','nu'],['ne','N','ね','ネ','ne'],['no','N','の','ノ','no'],
    ['ha','H','は','ハ','ha'],['hi','H','ひ','ヒ','hi'],['fu','H','ふ','フ','fu',['hu']],['he','H','へ','ヘ','he'],['ho','H','ほ','ホ','ho'],
    ['ma','M','ま','マ','ma'],['mi','M','み','ミ','mi'],['mu','M','む','ム','mu'],['me','M','め','メ','me'],['mo','M','も','モ','mo'],
    ['ya','Y','や','ヤ','ya'],['yu','Y','ゆ','ユ','yu'],['yo','Y','よ','ヨ','yo'],
    ['ra','R','ら','ラ','ra'],['ri','R','り','リ','ri'],['ru','R','る','ル','ru'],['re','R','れ','レ','re'],['ro','R','ろ','ロ','ro'],
    ['wa','W','わ','ワ','wa'],['wo','W','を','ヲ','wo',['o']],['n','N finale','ん','ン','n',['nn']]
  ].map(x=>kanaItem(`p-${x[0]}`,'primary',x[1],x[2],x[3],x[4],x[5]||[])),
  ...[
    ['ga','G','が','ガ','ga'],['gi','G','ぎ','ギ','gi'],['gu','G','ぐ','グ','gu'],['ge','G','げ','ゲ','ge'],['go','G','ご','ゴ','go'],
    ['za','Z','ざ','ザ','za'],['ji','Z','じ','ジ','ji',['zi']],['zu','Z','ず','ズ','zu'],['ze','Z','ぜ','ゼ','ze'],['zo','Z','ぞ','ゾ','zo'],
    ['da','D','だ','ダ','da'],['di','D','ぢ','ヂ','di',['ji','zi']],['du','D','づ','ヅ','du',['zu','dzu']],['de','D','で','デ','de'],['do','D','ど','ド','do'],
    ['ba','B','ば','バ','ba'],['bi','B','び','ビ','bi'],['bu','B','ぶ','ブ','bu'],['be','B','べ','ベ','be'],['bo','B','ぼ','ボ','bo'],
    ['pa','P','ぱ','パ','pa'],['pi','P','ぴ','ピ','pi'],['pu','P','ぷ','プ','pu'],['pe','P','ぺ','ペ','pe'],['po','P','ぽ','ポ','po']
  ].map(x=>kanaItem(`v-${x[0]}`,'voiced',x[1],x[2],x[3],x[4],x[5]||[])),
  ...[
    ['kya','K','きゃ','キャ','kya'],['kyu','K','きゅ','キュ','kyu'],['kyo','K','きょ','キョ','kyo'],
    ['sha','S','しゃ','シャ','sha',['sya']],['shu','S','しゅ','シュ','shu',['syu']],['sho','S','しょ','ショ','sho',['syo']],
    ['cha','T','ちゃ','チャ','cha',['tya']],['chu','T','ちゅ','チュ','chu',['tyu']],['cho','T','ちょ','チョ','cho',['tyo']],
    ['nya','N','にゃ','ニャ','nya'],['nyu','N','にゅ','ニュ','nyu'],['nyo','N','にょ','ニョ','nyo'],
    ['hya','H','ひゃ','ヒャ','hya'],['hyu','H','ひゅ','ヒュ','hyu'],['hyo','H','ひょ','ヒョ','hyo'],
    ['mya','M','みゃ','ミャ','mya'],['myu','M','みゅ','ミュ','myu'],['myo','M','みょ','ミョ','myo'],
    ['rya','R','りゃ','リャ','rya'],['ryu','R','りゅ','リュ','ryu'],['ryo','R','りょ','リョ','ryo'],
    ['gya','G','ぎゃ','ギャ','gya'],['gyu','G','ぎゅ','ギュ','gyu'],['gyo','G','ぎょ','ギョ','gyo'],
    ['ja','J','じゃ','ジャ','ja',['zya']],['ju','J','じゅ','ジュ','ju',['zyu']],['jo','J','じょ','ジョ','jo',['zyo']],
    ['bya','B','びゃ','ビャ','bya'],['byu','B','びゅ','ビュ','byu'],['byo','B','びょ','ビョ','byo'],
    ['pya','P','ぴゃ','ピャ','pya'],['pyu','P','ぴゅ','ピュ','pyu'],['pyo','P','ぴょ','ピョ','pyo']
  ].map(x=>kanaItem(`y-${x[0]}`,'yoon',x[1],x[2],x[3],x[4],x[5]||[])),
  ...[
    ['fa','F','ふぁ','ファ','fa'],['fi','F','ふぃ','フィ','fi'],['fe','F','ふぇ','フェ','fe'],['fo','F','ふぉ','フォ','fo'],
    ['va','V','ゔぁ','ヴァ','va'],['vi','V','ゔぃ','ヴィ','vi'],['vu','V','ゔ','ヴ','vu'],['ve','V','ゔぇ','ヴェ','ve'],['vo','V','ゔぉ','ヴォ','vo'],
    ['wi','W','うぃ','ウィ','wi'],['we','W','うぇ','ウェ','we'],['who','W','うぉ','ウォ','wo'],
    ['she','S','しぇ','シェ','she',['sye']],['je','J','じぇ','ジェ','je',['zye']],['che','T','ちぇ','チェ','che',['tye']],
    ['ti','T','てぃ','ティ','ti'],['tu','T','とぅ','トゥ','tu'],['di2','D','でぃ','ディ','di'],['du2','D','どぅ','ドゥ','du'],
    ['tsa','TS','つぁ','ツァ','tsa'],['tsi','TS','つぃ','ツィ','tsi'],['tse','TS','つぇ','ツェ','tse'],['tso','TS','つぉ','ツォ','tso']
  ].map(x=>kanaItem(`e-${x[0]}`,'extended',x[1],x[2],x[3],x[4],x[5]||[]))
];

const allKanaIds = category => KANA_ITEMS.filter(x => !category || x.category === category).map(x => x.id);
const defaultKanaState = () => ({
  version:1,
  config:{ script:'hiragana', direction:'kana-romaji', mode:'multiple', selectedIds:allKanaIds('primary') },
  lastResult:null,
  activeSession:null,
  customizeOpen:false
});
function loadKanaState(){
  try{
    const parsed=JSON.parse(window.__KOTOBA_BOOT_KANA__||localStorage.getItem(KANA_STORAGE_KEY)||'null');
    if(!parsed) return defaultKanaState();
    const d=defaultKanaState();
    const config={...d.config,...(parsed.config||{})};
    config.selectedIds=Array.isArray(config.selectedIds)?config.selectedIds.filter(id=>KANA_ITEMS.some(x=>x.id===id)):d.config.selectedIds;
    return {...d,...parsed,config,lastResult:parsed.lastResult||null,activeSession:parsed.activeSession||null,customizeOpen:false};
  }catch{return defaultKanaState()}
}
function saveKanaState(){
  kanaState.activeSession=kanaRuntime?serializeKanaRuntime(kanaRuntime):null;
  const data={version:1,config:kanaState.config,lastResult:kanaState.lastResult,activeSession:kanaState.activeSession};
  if(window.__KOTOBA_IDB_API__)window.__KOTOBA_IDB_API__.put('kana',data).catch(e=>console.error('Kotoba Kana IndexedDB write failed',e));
  else localStorage.setItem(KANA_STORAGE_KEY,JSON.stringify(data));
}
function serializeKanaRuntime(r){if(!r)return null;return {...r,elapsedBeforePause:kanaElapsed(r),timerStartedAt:null,paused:true,autoPaused:false,feedback:null,feedbackUntil:null}}
function restoreKanaRuntime(raw){
  if(!raw||!Array.isArray(raw.questions)||!raw.questions.length||raw.index>=raw.questions.length)return null;
  return {...raw,timerStartedAt:null,feedback:null,feedbackUntil:null,paused:true,autoPaused:false};
}
function kanaNormalizeRomaji(v){return String(v||'').trim().toLowerCase().replace(/[\s\-_'’]/g,'').replace(/ō/g,'ou').replace(/ū/g,'uu')}
function kanaSelectedItems(){const set=new Set(kanaState.config.selectedIds||[]);return KANA_ITEMS.filter(x=>set.has(x.id))}
function kanaScripts(){return kanaState.config.script==='both'?['hiragana','katakana']:[kanaState.config.script]}
function kanaSymbol(item,script){return script==='katakana'?item.kata:item.hira}
function formatKanaTime(ms){const total=Math.max(0,Math.floor(ms/1000));return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`}
function kanaElapsed(r=kanaRuntime){if(!r)return 0;return Math.max(0,Number(r.elapsedBeforePause||0)+(r.paused?0:Math.max(0,Date.now()-Number(r.timerStartedAt||Date.now()))))}
function kanaQuestionMode(i,direction,seed){
  const mode=kanaState.config.mode;
  if(direction==='romaji-kana') return 'multiple';
  if(mode==='multiple'||mode==='manual') return mode;
  return hashString(`${seed}:mode:${i}`)%2===0?'multiple':'manual';
}
function kanaQuestionDirection(i,seed){
  const d=kanaState.config.direction;
  if(kanaState.config.mode==='manual') return 'kana-romaji';
  if(d!=='mixed') return d;
  return hashString(`${seed}:direction:${i}`)%2===0?'kana-romaji':'romaji-kana';
}
function kanaDistractors(item,script,seed){
  const pool=KANA_ITEMS.filter(x=>x.id!==item.id);
  return seededShuffle(pool,`${seed}:distractors:${item.id}:${script}`).slice(0,3).map(x=>kanaSymbol(x,script));
}
function buildKanaQuestions(sourceItems=null, retryQuestions=null){
  const seed=`kana:${Date.now()}:${hashString(JSON.stringify(kanaState.config))}`;
  if(Array.isArray(retryQuestions)&&retryQuestions.length){
    return {seed,questions:retryQuestions.map((old,i)=>{
      const item=KANA_ITEMS.find(x=>x.id===old.itemId);if(!item)return null;
      const q={itemId:item.id,script:old.script,direction:old.direction,mode:old.mode,kana:kanaSymbol(item,old.script),romaji:item.romaji,accepted:item.accepted};
      if(q.mode==='multiple') q.options=q.direction==='kana-romaji'?seededShuffle([item.romaji,...seededShuffle(KANA_ITEMS.filter(x=>x.id!==item.id),`${seed}:r:${i}`).slice(0,3).map(x=>x.romaji)],`${seed}:ro:${i}`):seededShuffle([q.kana,...kanaDistractors(item,q.script,`${seed}:r:${i}`)],`${seed}:ko:${i}`);
      return q;
    }).filter(Boolean)};
  }
  const items=sourceItems||kanaSelectedItems();
  let bases=[];for(const item of items)for(const script of kanaScripts())bases.push({item,script});
  bases=seededShuffle(bases,`${seed}:order`);
  const questions=bases.map((base,i)=>{
    const direction=kanaQuestionDirection(i,seed), mode=kanaQuestionMode(i,direction,seed), item=base.item;
    const q={itemId:item.id,script:base.script,direction,mode,kana:kanaSymbol(item,base.script),romaji:item.romaji,accepted:item.accepted};
    if(mode==='multiple'){
      if(direction==='kana-romaji'){
        const opts=seededShuffle(KANA_ITEMS.filter(x=>x.id!==item.id),`${seed}:romaji-d:${i}`).map(x=>x.romaji).filter((x,idx,a)=>x!==item.romaji&&a.indexOf(x)===idx).slice(0,3);
        q.options=seededShuffle([item.romaji,...opts],`${seed}:romaji-o:${i}`);
      }else q.options=seededShuffle([q.kana,...kanaDistractors(item,base.script,`${seed}:kana-d:${i}`)],`${seed}:kana-o:${i}`);
    }
    return q;
  });
  return {seed,questions};
}
function startKanaExercise(opts={}){
  if(!(kanaState.config.selectedIds||[]).length)return;
  const built=buildKanaQuestions(null,opts.retryQuestions||null);
  kanaRuntime={seed:built.seed,questions:built.questions,index:0,errors:[],wrongAttempts:0,elapsedBeforePause:0,timerStartedAt:null,paused:false,autoPaused:false,feedback:null,started:false,originalConfig:JSON.parse(JSON.stringify(kanaState.config))};
  view='kana-exercise';saveKanaState();render();startKanaTimerAtFirstQuestion();
}
function startKanaTimerAtFirstQuestion(){if(!kanaRuntime||kanaRuntime.started)return;kanaRuntime.started=true;kanaRuntime.timerStartedAt=Date.now();saveKanaState();startKanaClock()}
let kanaClockTimer=null;
function startKanaClock(){clearInterval(kanaClockTimer);kanaClockTimer=setInterval(()=>{const el=document.querySelector('[data-kana-timer]');if(el&&kanaRuntime&&!kanaRuntime.paused)el.textContent=formatKanaTime(kanaElapsed())},500)}
function pauseKanaTimer(manual=true){if(!kanaRuntime||kanaRuntime.paused)return;kanaRuntime.elapsedBeforePause=kanaElapsed();kanaRuntime.timerStartedAt=null;kanaRuntime.paused=true;kanaRuntime.autoPaused=!manual;saveKanaState();if(manual&&view==='kana-exercise')render()}
function resumeKanaTimer(manual=true){if(!kanaRuntime||!kanaRuntime.paused)return;if(!manual&&!kanaRuntime.autoPaused)return;kanaRuntime.paused=false;kanaRuntime.autoPaused=false;kanaRuntime.timerStartedAt=Date.now();saveKanaState();if(manual&&view==='kana-exercise')render();startKanaClock()}
function setKanaConfig(key,value){
  const c=kanaState.config;c[key]=value;
  if(key==='mode'&&value==='manual')c.direction='kana-romaji';
  saveKanaState();renderKana();
}
function toggleKanaCategory(category){
  const ids=allKanaIds(category),set=new Set(kanaState.config.selectedIds||[]),all=ids.every(id=>set.has(id));
  ids.forEach(id=>all?set.delete(id):set.add(id));kanaState.config.selectedIds=Array.from(set);saveKanaState();renderKana();
}
function toggleKanaId(id){const set=new Set(kanaState.config.selectedIds||[]);set.has(id)?set.delete(id):set.add(id);kanaState.config.selectedIds=Array.from(set);saveKanaState();renderKana()}
function kanaSelectionCount(){return kanaSelectedItems().length*kanaScripts().length}
function renderKana(){
  const selected=new Set(kanaState.config.selectedIds||[]),count=kanaSelectionCount();
  const categoryHtml=KANA_CATEGORIES.map(cat=>{const ids=allKanaIds(cat.id),n=ids.filter(id=>selected.has(id)).length;return `<button class="kana-category ${n===ids.length?'selected':''}" data-kana-category="${cat.id}"><span><strong>${cat.label}</strong><span>${cat.note}</span></span><span class="kana-category-count">${n}/${ids.length}</span></button>`}).join('');
  let grid='';
  if(kanaState.customizeOpen){
    for(const cat of KANA_CATEGORIES){const items=KANA_ITEMS.filter(x=>x.category===cat.id);const rows=[...new Set(items.map(x=>x.row))];grid+=`<div class="kana-row"><div class="kana-row-label">${cat.label}</div>`+rows.map(row=>`<div class="kana-row"><div class="kana-row-label">${row}</div><div class="kana-chip-grid">${items.filter(x=>x.row===row).map(x=>`<button class="kana-chip ${selected.has(x.id)?'selected':''}" data-kana-id="${x.id}"><span lang="ja">${kanaState.config.script==='katakana'?x.kata:kanaState.config.script==='both'?`${x.hira} ${x.kata}`:x.hira}</span><small>${x.romaji}</small></button>`).join('')}</div></div>`).join('')+`</div>`}
  }
  const c=kanaState.config;
  shell(`<header class="kana-page-header"><p class="eyebrow kana-accent">ALLENAMENTO KANA</p><h1>Kana</h1><p>Allenati con hiragana e katakana.</p></header>
  ${kanaRuntime ? '<section class="panel resume-session-card"><h2>Esercizio in pausa</h2><p>Puoi continuare dal carattere su cui ti eri fermato.</p><button class="btn primary wide" data-action="kana-continue-session">Riprendi esercizio</button></section>' : ''}
  <section class="panel kana-panel"><div class="kana-section-title"><h2>Sillabario</h2></div><div class="kana-segmented cols-3">${[['hiragana','Hiragana'],['katakana','Katakana'],['both','Entrambi']].map(([v,l])=>`<button class="${c.script===v?'selected':''}" data-kana-config="script" data-value="${v}">${l}</button>`).join('')}</div></section>
  <section class="panel kana-panel"><div class="kana-section-title"><h2>Caratteri</h2><small>${selected.size} su ${KANA_ITEMS.length}</small></div><div class="kana-category-list">${categoryHtml}</div><div class="kana-customize-head"><button class="text-btn" data-action="kana-customize">${kanaState.customizeOpen?'Nascondi selezione':'Personalizza simboli'}</button><span class="field-help" style="margin:0">${count} domande</span></div>${kanaState.customizeOpen?`<div class="kana-grid-wrap"><div class="kana-grid-actions"><button class="text-btn" data-action="kana-select-all">Seleziona tutti</button><button class="text-btn" data-action="kana-select-none">Nessuno</button></div>${grid}</div>`:''}</section>
  <section class="panel kana-panel"><div class="kana-section-title"><h2>Direzione</h2></div><div class="kana-segmented cols-3">${[['kana-romaji','Kana → romaji'],['romaji-kana','Romaji → kana'],['mixed','Mista']].map(([v,l])=>`<button class="${c.direction===v?'selected':''}" data-kana-config="direction" data-value="${v}" ${c.mode==='manual'&&v!=='kana-romaji'?'disabled':''}>${l}</button>`).join('')}</div>${c.mode==='manual'?'<p class="field-help" style="margin-bottom:0">Con inserimento manuale si esercita Kana → romaji.</p>':''}</section>
  <section class="panel kana-panel"><div class="kana-section-title"><h2>Risposta</h2></div><div class="kana-segmented cols-3">${[['multiple','Scelta multipla'],['manual','Manuale'],['mixed','Mista']].map(([v,l])=>`<button class="${c.mode===v?'selected':''}" data-kana-config="mode" data-value="${v}">${l}</button>`).join('')}</div><p class="field-help" style="margin-bottom:0">Nella modalità mista, Romaji → kana usa sempre la scelta multipla.</p></section>
  <p class="kana-start-summary"><strong>${count}</strong> domande · ogni simbolo selezionato compare una volta${c.script==='both'?' per ciascun sillabario':''}.</p><button class="btn primary wide" data-action="kana-start" ${count?'':'disabled'}>Inizia esercizio</button>${kanaState.lastResult?`<button class="btn secondary wide" style="margin-top:9px" data-action="kana-last-result">Ultimo risultato</button>`:''}`,'kana');
  document.querySelectorAll('[data-kana-config]').forEach(b=>b.addEventListener('click',()=>setKanaConfig(b.dataset.kanaConfig,b.dataset.value)));
  document.querySelectorAll('[data-kana-category]').forEach(b=>b.addEventListener('click',()=>toggleKanaCategory(b.dataset.kanaCategory)));
  document.querySelectorAll('[data-kana-id]').forEach(b=>b.addEventListener('click',()=>toggleKanaId(b.dataset.kanaId)));
  document.querySelector('[data-action="kana-customize"]')?.addEventListener('click',()=>{kanaState.customizeOpen=!kanaState.customizeOpen;renderKana()});
  document.querySelector('[data-action="kana-select-all"]')?.addEventListener('click',()=>{kanaState.config.selectedIds=KANA_ITEMS.map(x=>x.id);saveKanaState();renderKana()});
  document.querySelector('[data-action="kana-select-none"]')?.addEventListener('click',()=>{kanaState.config.selectedIds=[];saveKanaState();renderKana()});
  document.querySelector('[data-action="kana-start"]')?.addEventListener('click',()=>startKanaExercise());
  document.querySelector('[data-action="kana-continue-session"]')?.addEventListener('click',()=>{view='kana-exercise';renderKanaExercise()});
  document.querySelector('[data-action="kana-last-result"]')?.addEventListener('click',()=>{view='kana-complete';render()});
}
function currentKanaQuestion(){return kanaRuntime?.questions?.[kanaRuntime.index]||null}
function submitKanaAnswer(value){
  if(!kanaRuntime||kanaRuntime.paused||kanaRuntime.feedback)return;const q=currentKanaQuestion();if(!q)return;
  const answer=String(value??'');let correct=false;
  if(q.direction==='kana-romaji') correct=(q.accepted||[q.romaji]).map(kanaNormalizeRomaji).includes(kanaNormalizeRomaji(answer));
  else correct=answer===q.kana;
  if(!correct){kanaRuntime.wrongAttempts++;kanaRuntime.errors.push({itemId:q.itemId,script:q.script,direction:q.direction,mode:q.mode,kana:q.kana,romaji:q.romaji,given:answer});}
  kanaRuntime.feedback={correct,answer};saveKanaState();renderKanaExercise();clearTimeout(kanaFeedbackTimer);kanaFeedbackTimer=setTimeout(advanceKanaQuestion,correct?300:1050);
}
function advanceKanaQuestion(){if(!kanaRuntime)return;kanaRuntime.feedback=null;kanaRuntime.index++;if(kanaRuntime.index>=kanaRuntime.questions.length)return finishKanaExercise();saveKanaState();renderKanaExercise()}
function finishKanaExercise(){
  if(!kanaRuntime)return;clearInterval(kanaClockTimer);const elapsed=kanaElapsed(),total=kanaRuntime.questions.length,wrong=kanaRuntime.errors.length;
  const result={completedAt:new Date().toISOString(),elapsedMs:elapsed,total,correct:Math.max(0,total-wrong),wrongCharacters:wrong,wrongAttempts:kanaRuntime.wrongAttempts,errors:kanaRuntime.errors,questions:kanaRuntime.questions,config:kanaRuntime.originalConfig||kanaState.config};
  kanaState.lastResult=result;kanaRuntime=null;kanaState.activeSession=null;saveKanaState();view='kana-complete';render();
}
function renderKanaExercise(){
  document.body.classList.add('kotoba-exercise-viewport');
  if(!kanaRuntime){view='kana';return renderKana()}const q=currentKanaQuestion();if(!q)return finishKanaExercise();const f=kanaRuntime.feedback;const prompt=q.direction==='kana-romaji'?'Scrivi o scegli il romaji':'Scegli il kana corretto';const main=q.direction==='kana-romaji'?q.kana:q.romaji;
  const answerArea=q.mode==='multiple'?`<div class="options">${q.options.map(opt=>{const isCorrect=(q.direction==='kana-romaji'?opt===q.romaji:opt===q.kana),isChosen=f&&opt===f.answer;const cls=f?(isCorrect?'correct-reveal':(isChosen&&!f.correct?'wrong-reveal':'')):'';return `<button class="option kana-option ${cls}" data-kana-answer="${escapeHtml(opt)}" ${f?'disabled':''}>${escapeHtml(opt)}</button>`}).join('')}</div>`:`<form data-kana-form><input class="answer-input" data-kana-input autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="text" placeholder="Scrivi il romaji" ${f?'disabled':''}><button class="btn primary wide" type="submit" ${f?'disabled':''}>Conferma</button></form>`;
  const note=f&&!f.correct?`<div class="kana-answer-note">Risposta corretta: ${escapeHtml(q.direction==='kana-romaji'?q.romaji:q.kana)}</div>`:'<div class="kana-answer-note"></div>';
  root.innerHTML=`<div class="app-shell"><main class="screen kana-session-screen"><div class="kana-session-header"><button class="text-btn" data-action="kana-exit">Esci</button><span>${kanaRuntime.index+1} / ${kanaRuntime.questions.length}</span><span class="kana-timer" data-kana-timer>${formatKanaTime(kanaElapsed())}</span><button class="text-btn" data-action="kana-pause">Pausa</button></div><div class="kana-progress"><i style="width:${((kanaRuntime.index)/kanaRuntime.questions.length)*100}%"></i></div><section class="study-card kana-question-card"><div class="kana-question-label">${prompt}</div><div class="kana-question-main ${q.direction==='romaji-kana'?'romaji':''}" lang="${q.direction==='kana-romaji'?'ja':'en'}">${escapeHtml(main)}</div>${answerArea}${note}</section></main>${kanaRuntime.paused?`<div class="kana-pause-overlay"><div class="kana-pause-card"><div class="kana-pause-mark">Ⅱ</div><h2>In pausa</h2><p>Domanda e risposte sono nascoste. Il cronometro è fermo.</p><button class="btn primary wide" data-action="kana-resume">Riprendi</button><button class="btn secondary wide" data-action="kana-exit">Esci dall’esercizio</button></div></div>`:''}</div>`;
  document.querySelectorAll('[data-kana-answer]').forEach(b=>b.addEventListener('click',()=>submitKanaAnswer(b.dataset.kanaAnswer)));
  document.querySelector('[data-kana-form]')?.addEventListener('submit',e=>{e.preventDefault();submitKanaAnswer(document.querySelector('[data-kana-input]')?.value||'')});
  document.querySelector('[data-action="kana-pause"]')?.addEventListener('click',()=>pauseKanaTimer(true));
  document.querySelector('[data-action="kana-resume"]')?.addEventListener('click',()=>resumeKanaTimer(true));
  document.querySelectorAll('[data-action="kana-exit"]').forEach(b=>b.addEventListener('click',()=>{clearInterval(kanaClockTimer);clearTimeout(kanaFeedbackTimer);kanaRuntime=null;kanaState.activeSession=null;saveKanaState();view='kana';render()}));
  if(!kanaRuntime.paused&&!f){if(window.matchMedia('(pointer: fine)').matches)setTimeout(()=>document.querySelector('[data-kana-input]')?.focus(),0);startKanaClock()}
}
function renderKanaComplete(){
  const r=kanaState.lastResult;if(!r){view='kana';return renderKana()}const pct=r.total?Math.round(r.correct/r.total*100):0;
  const errors=(r.errors||[]).map(e=>`<div class="kana-error-row"><div class="kana-error-symbol" lang="ja">${escapeHtml(e.kana)}</div><div><strong>${escapeHtml(e.romaji)}</strong><span>Risposta data: ${escapeHtml(e.given||'—')} · ${e.direction==='kana-romaji'?'Kana → romaji':'Romaji → kana'}</span></div></div>`).join('');
  root.innerHTML=`<div class="app-shell"><main class="screen kana-session-screen"><section class="kana-result-hero"><p class="eyebrow kana-accent">ESERCIZIO COMPLETATO</p><h1>Kana</h1><div class="kana-score">${r.correct}/${r.total}</div><p>${pct}% corrette</p><div class="kana-result-time">${formatKanaTime(r.elapsedMs)}</div></section><section class="panel"><div class="summary-list"><div><span>Caratteri sbagliati</span><strong>${r.wrongCharacters}</strong></div><div><span>Tentativi errati</span><strong>${r.wrongAttempts}</strong></div><div><span>Tempo</span><strong>${formatKanaTime(r.elapsedMs)}</strong></div></div></section>${r.errors?.length?`<section class="panel"><h2>Errori</h2><div class="kana-error-list">${errors}</div></section>`:''}<div class="kana-result-actions">${r.errors?.length?'<button class="btn primary wide" data-action="kana-retry-errors">Riprova gli errori</button>':''}<button class="btn secondary wide" data-action="kana-repeat">Ripeti esercizio</button><button class="btn secondary wide" data-action="kana-back">Torna a Kana</button></div></main></div>`;
  document.querySelector('[data-action="kana-retry-errors"]')?.addEventListener('click',()=>{kanaState.config=JSON.parse(JSON.stringify(r.config));saveKanaState();startKanaExercise({retryQuestions:r.errors})});
  document.querySelector('[data-action="kana-repeat"]')?.addEventListener('click',()=>{kanaState.config=JSON.parse(JSON.stringify(r.config));saveKanaState();startKanaExercise()});
  document.querySelector('[data-action="kana-back"]')?.addEventListener('click',()=>{view='kana';render()});
}
document.addEventListener('visibilitychange',()=>{if(view!=='kana-exercise'||!kanaRuntime)return;if(document.visibilityState==='hidden'&&!kanaRuntime.paused)pauseKanaTimer(false);else if(document.visibilityState==='visible'&&kanaRuntime.paused&&kanaRuntime.autoPaused){resumeKanaTimer(false);renderKanaExercise()}});


// 3.1.11: the Android soft keyboard and the iOS/PWA visual viewport may
// shrink independently of the layout viewport. Keep input inside the VISIBLE
// exercise card without shifting the navigation screens or changing progress.
let kotobaKeyboardFrame = 0;
function kotobaFitVisibleAnswer() {
  const activeInput = document.activeElement;
  const isAnswer = !!activeInput && (activeInput.matches('#answer-input, [data-kana-input]'));
  const isExercise = view === 'session' || view === 'kana-exercise';
  const enabled = isAnswer && isExercise && document.contains(activeInput);
  document.body.classList.toggle('kotoba-keyboard-active', enabled);
  if (!enabled) {
    document.documentElement.style.removeProperty('--kotoba-exercise-height');
    return;
  }
  const viewport = window.visualViewport;
  const availableHeight = Math.max(180, Math.floor(viewport?.height || window.innerHeight));
  document.documentElement.style.setProperty('--kotoba-exercise-height', `${availableHeight}px`);
  const card = activeInput.closest('.study-card');
  if (!card) return;
  const inputRect = activeInput.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const targetBottom = Math.min(cardRect.bottom - 14, availableHeight - 14);
  if (inputRect.bottom > targetBottom) {
    card.scrollTop += inputRect.bottom - targetBottom + 12;
  } else if (inputRect.top < cardRect.top + 12) {
    card.scrollTop -= cardRect.top + 16 - inputRect.top;
  }
}
function kotobaScheduleVisibleAnswer() {
  if (kotobaKeyboardFrame) cancelAnimationFrame(kotobaKeyboardFrame);
  kotobaKeyboardFrame = requestAnimationFrame(() => {
    kotobaKeyboardFrame = 0;
    kotobaFitVisibleAnswer();
  });
}
document.addEventListener('focusin', event => {
  if (event.target?.matches?.('#answer-input, [data-kana-input]')) {
    kotobaScheduleVisibleAnswer();
  }
});
document.addEventListener('focusout', event => {
  if (event.target?.matches?.('#answer-input, [data-kana-input]')) {
    setTimeout(kotobaScheduleVisibleAnswer, 120);
  }
});
window.visualViewport?.addEventListener('resize', kotobaScheduleVisibleAnswer);
window.visualViewport?.addEventListener('scroll', kotobaScheduleVisibleAnswer);
window.addEventListener('resize', kotobaScheduleVisibleAnswer);

function render() {
  document.body.classList.toggle('kotoba-exercise-viewport', view === 'session' || view === 'kana-exercise');
  if (!['session', 'kana-exercise'].includes(view)) kotobaFitVisibleAnswer();
  if (!vocabulary.length) return;
  switch (view) {
    case 'onboarding': return renderOnboarding();
    case 'topics': return renderTopics();
    case 'kana': return renderKana();
    case 'kana-exercise': return renderKanaExercise();
    case 'kana-complete': return renderKanaComplete();
    case 'progress': return renderProgress();
    case 'settings': return renderSettings();
    case 'free-config': return renderFreeConfig();
    case 'session': return renderSession();
    case 'session-complete': return renderSessionComplete();
    default: return renderHome();
  }
}

function init() {
  kanaState = loadKanaState();
  kanaRuntime = restoreKanaRuntime(kanaState.activeSession);
  vocabulary = EMBEDDED_VOCABULARY.entries || [];
  rebuildAnswerEquivalenceIndexes(vocabulary);
  observedDayKey = localDateKey();
  scheduleMidnightRefresh();
  startSessionCheckpointing();
  render();
}

init();


})();
