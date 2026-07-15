import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationsGateway } from './notifications.gateway';

@Controller('machines')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationsGateway: NotificationsGateway
  ) {}

  @Get()
  getAllMachines() {
    return this.appService.getAllMachines();
  }

  @Get(':id')
  getMachineById(@Param('id') id: string) {
    return this.appService.getMachineById(Number(id));
  }

  @Post()
  createMachine(@Body() body: any) {
    return this.appService.createMachine(body);
  }

  @Put(':id')
  updateMachine(@Param('id') id: string, @Body() body: any) {
    return this.appService.updateMachine(Number(id), body);
  }

  @Delete(':id')
  deleteMachine(@Param('id') id: string) {
    return this.appService.deleteMachine(Number(id));
  }

  // Fallback endpoint for retrocompatibility / legacy energy telemetry inputs
  @Post(':id/energy')
  updateEnergy(@Param('id') id: string, @Body() body: { energy: number; name: string; uid: string }) {
    if (body.energy > 150) {
      this.notificationsGateway.sendHighEnergyAlert({
        id: Number(id),
        name: body.name,
        uid: body.uid,
        energy: body.energy,
      });
    }
    return { success: true };
  }

  // Fallback endpoint for legacy front-end custom notifications
  @Post('event')
  handleMachineEvent(@Body() body: { type: string; message: string; machine?: any }) {
    this.notificationsGateway.sendNotification(body);
    if ((body.type === 'Add' || body.type === 'Edit') && body.machine && body.machine.energy > 150) {
      this.notificationsGateway.sendHighEnergyAlert(body.machine);
    }
    return { success: true };
  }
}
