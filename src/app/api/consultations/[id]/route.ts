// app/api/consultations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ===== GET - Получить одну заявку =====
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        let id: string | undefined;
        
        if (params && typeof params.then === 'function') {
            const resolvedParams = await params;
            id = resolvedParams.id;
        } else {
            id = (params as { id: string }).id;
        }
        
        if (!id) {
            return NextResponse.json(
                { error: 'ID не указан' },
                { status: 400 }
            );
        }

        const consultation = await prisma.consultation.findUnique({
            where: { id: parseInt(id) },
        });

        if (!consultation) {
            return NextResponse.json(
                { error: 'Заявка не найдена' },
                { status: 404 }
            );
        }

        return NextResponse.json(consultation);
    } catch (error) {
        console.error('Ошибка:', error);
        return NextResponse.json(
            { error: 'Ошибка при получении заявки' },
            { status: 500 }
        );
    }
}

// ===== PATCH - Обновить статус =====
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    console.log('=== ЗАПРОС НА ОБНОВЛЕНИЕ ===');
    
    try {
        let id: string | undefined;
        
        if (params && typeof params.then === 'function') {
            const resolvedParams = await params;
            id = resolvedParams.id;
        } else {
            id = (params as { id: string }).id;
        }
        
        if (!id) {
            const url = new URL(request.url);
            const pathParts = url.pathname.split('/');
            id = pathParts[pathParts.length - 1];
        }
        
        if (!id) {
            return NextResponse.json(
                { error: 'ID не указан' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Статус не указан' },
                { status: 400 }
            );
        }

        const validStatuses = ['NEW', 'IN_PROGRESS', 'COMPLETED', 'NO_ANSWER', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Некорректный статус. Доступные: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        const updatedConsultation = await prisma.consultation.update({
            where: { id: parseInt(id) },
            data: { status: status },
        });

        console.log(`Статус заявки #${id} обновлен на "${status}"`);
        return NextResponse.json(updatedConsultation);

    } catch (error) {
        console.error('Ошибка при обновлении:', error);
        
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json(
                { error: "Заявка не найдена" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { 
                error: "Ошибка при обновлении статуса",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}

// ===== DELETE - Удалить заявку =====
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Проверяем авторизацию
        const session = await auth();
        if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
            return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
        }

        let id: string | undefined;
        
        if (params && typeof params.then === 'function') {
            const resolvedParams = await params;
            id = resolvedParams.id;
        } else {
            id = (params as { id: string }).id;
        }
        
        if (!id) {
            const url = new URL(request.url);
            const pathParts = url.pathname.split('/');
            id = pathParts[pathParts.length - 1];
        }
        
        if (!id) {
            return NextResponse.json(
                { error: 'ID не указан' },
                { status: 400 }
            );
        }

        // Проверяем существование
        const existing = await prisma.consultation.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { error: 'Заявка не найдена' },
                { status: 404 }
            );
        }

        // Удаляем
        await prisma.consultation.delete({
            where: { id: parseInt(id) },
        });

        console.log(`Заявка #${id} удалена`);
        return NextResponse.json({ 
            success: true, 
            message: `Заявка #${id} удалена` 
        });

    } catch (error) {
        console.error('Ошибка при удалении:', error);
        return NextResponse.json(
            { 
                error: "Ошибка при удалении заявки",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}