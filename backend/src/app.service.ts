import { Injectable, OnModuleInit, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async onModuleInit() {
    await this.seedInitialMachines();
  }

  // Automatic Seeding if DB is empty
  private async seedInitialMachines() {
    const count = await this.prisma.machine.count();
    if (count === 0) {
      console.log('Database is empty. Seeding initial machines from machines.json dataset...');
      const initialMachines = [
        {
          uid: "MT001",
          name: "Pompe de refroidissement A1",
          ip: "172.16.1.20",
          zone: "Zone A",
          type: "Motor",
          protocol: "Modbus TCP",
          voltage: "400V",
          energy: 120,
          totalEnergyConsumed: 2450,
          reparationTime: "0h",
          responsible: "Alice Johnson",
          tags: JSON.stringify(["Pression", "Température"]),
          status: "Online",
          description: "Pompe principale à eau du système de refroidissement."
        },
        {
          uid: "MT002",
          name: "Convoyeur principal",
          ip: "172.16.1.21",
          zone: "Zone B",
          type: "Conveyor",
          protocol: "Profinet",
          voltage: "230V",
          energy: 110,
          totalEnergyConsumed: 4120,
          reparationTime: "0h",
          responsible: "Bob Smith",
          tags: JSON.stringify(["Vitesse", "Vibration"]),
          status: "Online",
          description: "Convoyeur de ligne d'assemblage principal."
        },
        {
          uid: "MT003",
          name: "Compresseur d'air C1",
          ip: "172.16.2.15",
          zone: "Zone A",
          type: "Compressor",
          protocol: "EtherNet/IP",
          voltage: "400V",
          energy: 90,
          totalEnergyConsumed: 1850,
          reparationTime: "2h 15m",
          responsible: "Alice Johnson",
          tags: JSON.stringify(["Pression d'air", "Débit"]),
          status: "Offline",
          description: "Compresseur d'air haute pression."
        },
        {
          uid: "MT004",
          name: "Générateur de secours X",
          ip: "172.16.3.10",
          zone: "Zone C",
          type: "Generator",
          protocol: "Modbus TCP",
          voltage: "11kV",
          energy: 140,
          totalEnergyConsumed: 3890,
          reparationTime: "0h",
          responsible: "Charlie Davis",
          tags: JSON.stringify(["Puissance", "Niveau Carburant"]),
          status: "Online",
          description: "Générateur électrique de secours."
        },
        {
          uid: "MT005",
          name: "Système d'éclairage LED",
          ip: "172.16.4.5",
          zone: "Zone A",
          type: "Lighting",
          protocol: "Modbus TCP",
          voltage: "230V",
          energy: 45,
          totalEnergyConsumed: 890,
          reparationTime: "0h",
          responsible: "Bob Smith",
          tags: JSON.stringify(["Éclairage", "LED"]),
          status: "Online",
          description: "Groupe principal d'éclairage d'entrepôt."
        },
        {
          uid: "MT006",
          name: "Chargeur de batteries",
          ip: "172.16.4.12",
          zone: "Zone C",
          type: "Battery Charger",
          protocol: "Profinet",
          voltage: "230V",
          energy: 110,
          totalEnergyConsumed: 1420,
          reparationTime: "1h 30m",
          responsible: "Charlie Davis",
          tags: JSON.stringify(["Charger", "Battery", "Critical"]),
          status: "Offline",
          description: "Forklift and mobile equipment battery charging bank."
        },
        {
          uid: "MT007",
          name: "Ventilateur d'extraction V2",
          ip: "172.16.1.30",
          zone: "Zone B",
          type: "Motor",
          protocol: "Modbus TCP",
          voltage: "230V",
          energy: 55,
          totalEnergyConsumed: 1120,
          reparationTime: "0h",
          responsible: "Alice Johnson",
          tags: JSON.stringify(["Ventilation", "Flux d'air"]),
          status: "Online",
          description: "Ventilateur d'extraction secondaire pour la ventilation de la Zone B."
        },
        {
          uid: "MT008",
          name: "Robot de soudage R1",
          ip: "172.16.5.10",
          zone: "Zone D",
          type: "Robot",
          protocol: "Profinet",
          voltage: "400V",
          energy: 130,
          totalEnergyConsumed: 6250,
          reparationTime: "0h",
          responsible: "Bob Smith",
          tags: JSON.stringify(["Automation", "Soudage", "Bras robotique"]),
          status: "Online",
          description: "Robot articulé automatisé pour les tâches de soudage de haute précision."
        },
        {
          uid: "MT009",
          name: "Broyeur industriel B1",
          ip: "172.16.2.22",
          zone: "Zone A",
          type: "Heavy Equipment",
          protocol: "EtherNet/IP",
          voltage: "400V",
          energy: 190,
          totalEnergyConsumed: 8740,
          reparationTime: "3h 45m",
          responsible: "Charlie Davis",
          tags: JSON.stringify(["Broyage", "Haute puissance", "Surcharge"]),
          status: "Offline",
          description: "Broyeur lourd de matériaux, actuellement hors ligne pour maintenance planifiée."
        }
      ];

      for (const machine of initialMachines) {
        await this.prisma.machine.create({ data: machine });
      }
      console.log('Seeding successfully completed!');
    }
  }

  // Parse serialized tags back to string array
  private formatMachine(machine: any) {
    if (!machine) return null;
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse(machine.tags);
    } catch {
      parsedTags = machine.tags ? machine.tags.split(',').map((t: string) => t.trim()) : [];
    }
    return {
      ...machine,
      tags: parsedTags,
    };
  }

  async getAllMachines() {
    const machines = await this.prisma.machine.findMany({
      orderBy: { id: 'asc' },
    });
    return machines.map(m => this.formatMachine(m));
  }

  async getMachineById(id: number) {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
    });
    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }
    return this.formatMachine(machine);
  }

  async createMachine(dto: any) {
    // Check uniqueness
    const existing = await this.prisma.machine.findUnique({
      where: { uid: dto.uid },
    });
    if (existing) {
      throw new ConflictException(`Machine with UID ${dto.uid} already exists`);
    }

    const serializedTags = Array.isArray(dto.tags) ? JSON.stringify(dto.tags) : JSON.stringify([]);
    const machine = await this.prisma.machine.create({
      data: {
        uid: dto.uid,
        name: dto.name,
        ip: dto.ip,
        zone: dto.zone,
        type: dto.type,
        protocol: dto.protocol,
        voltage: dto.voltage,
        energy: Number(dto.energy ?? 0),
        totalEnergyConsumed: Number(dto.totalEnergyConsumed ?? 0),
        reparationTime: dto.reparationTime ?? '0h',
        responsible: dto.responsible ?? 'Unassigned',
        tags: serializedTags,
        status: dto.status ?? 'Online',
        description: dto.description ?? '',
      },
    });

    const formatted = this.formatMachine(machine);

    // Broadcast Real-time Websocket events
    this.notificationsGateway.sendNotification({
      type: 'Add',
      message: `Added: ${formatted.name}`,
      machine: formatted,
    });

    if (formatted.energy > 150) {
      this.notificationsGateway.sendHighEnergyAlert(formatted);
    }

    return formatted;
  }

  async updateMachine(id: number, dto: any) {
    const existing = await this.prisma.machine.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    // Check unique UID constraint if UID is updated
    if (dto.uid && dto.uid !== existing.uid) {
      const conflict = await this.prisma.machine.findUnique({
        where: { uid: dto.uid },
      });
      if (conflict) {
        throw new ConflictException(`Machine with UID ${dto.uid} already exists`);
      }
    }

    const serializedTags = Array.isArray(dto.tags) ? JSON.stringify(dto.tags) : existing.tags;

    const machine = await this.prisma.machine.update({
      where: { id },
      data: {
        uid: dto.uid ?? existing.uid,
        name: dto.name ?? existing.name,
        ip: dto.ip ?? existing.ip,
        zone: dto.zone ?? existing.zone,
        type: dto.type ?? existing.type,
        protocol: dto.protocol ?? existing.protocol,
        voltage: dto.voltage ?? existing.voltage,
        energy: dto.energy !== undefined ? Number(dto.energy) : existing.energy,
        totalEnergyConsumed: dto.totalEnergyConsumed !== undefined ? Number(dto.totalEnergyConsumed) : existing.totalEnergyConsumed,
        reparationTime: dto.reparationTime ?? existing.reparationTime,
        responsible: dto.responsible ?? existing.responsible,
        tags: serializedTags,
        status: dto.status ?? existing.status,
        description: dto.description !== undefined ? dto.description : existing.description,
      },
    });

    const formatted = this.formatMachine(machine);

    // Broadcast Real-time Websocket events
    this.notificationsGateway.sendNotification({
      type: 'Edit',
      message: `Updated: ${formatted.name}`,
      machine: formatted,
    });

    if (formatted.energy > 150) {
      this.notificationsGateway.sendHighEnergyAlert(formatted);
    }

    return formatted;
  }

  async deleteMachine(id: number) {
    const existing = await this.prisma.machine.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    await this.prisma.machine.delete({
      where: { id },
    });

    const formatted = this.formatMachine(existing);

    // Broadcast Real-time Websocket events
    this.notificationsGateway.sendNotification({
      type: 'Delete',
      message: `Deleted: ${formatted.name}`,
      machine: formatted,
    });

    return { success: true };
  }
}
