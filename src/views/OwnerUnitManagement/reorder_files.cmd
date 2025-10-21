@echo off
echo 正在重新排列文件显示顺序...

REM 设置基准时间：2025-06-06 21:30:00
set baseTime=2025-06-06 21:30:00

REM 按照创建时间顺序重新设置文件的创建时间
REM 每个文件间隔1分钟，确保顺序正确

powershell -Command "(Get-Item 'Maintenance Plan Management.vue').CreationTime = '2025-06-06 21:30:00'"
powershell -Command "(Get-Item 'Maintenance point management.vue').CreationTime = '2025-06-06 21:31:00'"
powershell -Command "(Get-Item 'Unit Project Management.vue').CreationTime = '2025-06-06 21:32:00'"
powershell -Command "(Get-Item 'UnitDetail.vue').CreationTime = '2025-06-12 09:16:00'"
powershell -Command "(Get-Item 'Detail.vue').CreationTime = '2025-06-12 09:39:00'"
powershell -Command "(Get-Item 'ContractDetail.vue').CreationTime = '2025-06-12 13:30:00'"
powershell -Command "(Get-Item 'ContractInfo.vue').CreationTime = '2025-06-12 13:31:00'"
powershell -Command "(Get-Item 'addnewdispatchStaff.vue').CreationTime = '2025-06-13 20:11:00'"
powershell -Command "(Get-Item 'ProjectFormDialog.vue').CreationTime = '2025-06-13 21:19:00'"
powershell -Command "(Get-Item 'mpm-PlanDetail.vue').CreationTime = '2025-06-14 11:27:00'"
powershell -Command "(Get-Item 'mpm-TaskDetail.vue').CreationTime = '2025-06-14 11:28:00'"
powershell -Command "(Get-Item 'mpmTD-detail.vue').CreationTime = '2025-06-14 12:11:00'"
powershell -Command "(Get-Item 'Renewal.vue').CreationTime = '2025-06-14 21:16:00'"
powershell -Command "(Get-Item 'Renewal contract information.vue').CreationTime = '2025-06-14 21:17:00'"
powershell -Command "(Get-Item 'Renewal Project information.vue').CreationTime = '2025-06-14 21:21:00'"
powershell -Command "(Get-Item 'Renewwal Configure maintenance personnel.vue').CreationTime = '2025-06-14 21:22:00'"
powershell -Command "(Get-Item 'MapDialog.vue').CreationTime = '2025-06-22 16:28:00'"
powershell -Command "(Get-Item 'add new contract information.vue').CreationTime = '2025-06-22 17:07:00'"
powershell -Command "(Get-Item 'add new project information.vue').CreationTime = '2025-06-22 17:08:00'"
powershell -Command "(Get-Item 'add.vue').CreationTime = '2025-06-22 17:09:00'"
powershell -Command "(Get-Item 'look_ContractDetail_View.vue').CreationTime = '2025-06-23 00:51:00'"
powershell -Command "(Get-Item 'look_ContractInfo_View.vue').CreationTime = '2025-06-23 00:52:00'"
powershell -Command "(Get-Item 'look_ProjectInfo_View.vue').CreationTime = '2025-06-23 00:53:00'"
powershell -Command "(Get-Item 'ProjectInfo.vue').CreationTime = '2025-06-23 10:02:00'"
powershell -Command "(Get-Item 'look_newdispatchStaff.vue').CreationTime = '2025-06-23 16:30:00'"
powershell -Command "(Get-Item 'Payment Management.vue').CreationTime = '2025-07-08 01:03:00'"
powershell -Command "(Get-Item 'MapLocationPicker.vue').CreationTime = '2025-07-26 23:46:00'"
powershell -Command "(Get-Item 'MapLocationViewer.vue').CreationTime = '2025-07-26 23:47:00'"

echo 文件重新排列完成！
echo 现在文件应该按照创建时间的先后顺序显示了。

pause




